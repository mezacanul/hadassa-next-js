import mysql from "mysql2/promise";
import { parse, format } from "date-fns";
import { es, enUS } from "date-fns/locale";

export default async function handler(req, res) {
    const connection = await mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "",
        database: "hadassa",
    });

    try {
        if (req.method === "GET") {
            // GET: Return all citas
            const [rows] = await connection.execute("SELECT * FROM citas");
            res.status(200).json(rows);
            // GET: Filter citas by date
        } else if (req.method === "POST") {
            // TO DO: date sera un parametro
            // en el URL y pasara al metodo GET
            const { date } = req.body;

            // POST: Agendar cita
            // Validate date var presence in request
            if (!date) {
                // Se recibe desde POST el objeto con los
                // detalles de la CITA a agendar.
                const cita = req.body;
                
                let servicios = []
                let camasKeys = []
                // let citasDelDia = []
                let citasPorCama = []
                let horariosDispPorCama = {}
                // let horariosOcupados = {};
                
                
                let [citasDelDia] = await connection.execute(
                    `SELECT 
                        servicio_id, servicios.servicio, servicios.minutos, fecha, hora, cama_id
                    FROM 
                        citas 
                    LEFT JOIN clientas ON citas.clienta_id = clientas.id
                    LEFT JOIN servicios ON citas.servicio_id = servicios.id
                    LEFT JOIN lashistas ON citas.lashista_id = lashistas.id
                    WHERE fecha = '${cita.fecha}' AND citas.lashista_id = '${cita.lashista_id}'`
                    // Date format for CITAS table, FECHA column: 'YYYY-MM-DD'
                );

                [servicios] = await connection.execute(
                    `SELECT id, servicio, minutos, reglas_agenda FROM servicios`
                );
                servicios = Object.fromEntries(
                    servicios.map((servicio) => [
                        servicio.id,
                        {
                            servicio: servicio.servicio,
                            minutos: servicio.minutos,
                            regla: servicio.reglas_agenda,
                        },
                    ])
                );

                // Object : citasPorCama
                // Organizamos citas del dia por cama
                citasPorCama = citasDelDia.reduce((acc, item) => {
                    const { cama_id } = item;
                    acc[cama_id] = acc[cama_id] || [];
                    acc[cama_id].push(item);
                    return acc;
                }, {});

                // Asignamos camasKeys tomando la informacion 
                // de citasPorCama, ya que las camas se encuentran
                // filtradas por lashista en esa variable 
                camasKeys = Object.keys(citasPorCama)

                // Object : horariosDispPorCama
                // Extraemos NOMBRE DEL DIA para obtener
                // HORARIOS completos vacios del dia por cama.
                // (Por que fines de semana (S-D) tienen diferente horario)
                const parsedDate = parse(cita.fecha, "dd-MM-yyyy", new Date());
                const dayName = format(parsedDate, "eeee", { locale: enUS }); // Use 'eeee' for English
                const horarioDelDia = generarHorarioDelDia({
                    weekend: ["Saturday", "Sunday"].includes(dayName),
                });
                // Asignamos horariosDispPorCama
                camasKeys.forEach((camaID) => {
                    horariosDispPorCama[camaID] = horarioDelDia;
                });

                // TO DO:
                // ETA: 5 horas (20 horas)
                // Reducir horariosDispPorCama despues de comparar
                // con horarios de citas (citasPorCama) y
                // eliminar horarios no disponibles.
                // (Aplicar reglas de servicio [-1] [0,-1] [1])

                // 1.- Loopeamos por cada cama
                camasKeys.forEach((camaID, IDX) => {
                    const currentID = getFamTree(camasKeys, camaID, IDX).current;
                    const siblingID = getFamTree(camasKeys, camaID, IDX).siblings[0];

                    // 2.- Asignamos servicios por cama { ...camaID's: ... }
                    citasPorCama[currentID] = citasPorCama[currentID].map(
                        (cita) =>
                            getHorariosOcupadosPorServicio(
                                horariosDispPorCama[currentID],
                                servicios[cita.servicio_id],
                                cita,
                                servicios
                            )
                    );

                    // 3.- Lopeamos cada cita en la cama
                    citasPorCama[currentID].forEach(cita => {
                        // Eliminamos horarios ocupados en primera cama
                        (cita.horariosOcupados1aCama).forEach((horarioOcupado)=>{
                            horariosDispPorCama[currentID] = horariosDispPorCama[currentID].filter((horario)=>{
                                return horarioOcupado != horario
                            })

                            if(cita.reglasDeServicio[0] == 1){
                                horariosDispPorCama[siblingID] = horariosDispPorCama[siblingID].filter((horario)=>{
                                    return horarioOcupado != horario
                                })
                            }
                        })
                    });

                    citasPorCama[currentID].forEach(cita => {
                        // Loopeamos las reglas de servicio 
                        cita.reglasDeServicio.forEach((directive)=>{
                            if(directive == -1){
                                horariosDispPorCama[siblingID] = horariosDispPorCama[siblingID].map((horario2aCama)=>{
                                    if(horario2aCama == cita.horariosMantener2aCama[cita.horariosMantener2aCama.length - 1]){
                                        return `-${horario2aCama}`
                                    } else {
                                        return horario2aCama
                                    }
                                })
                            } else if(directive == 0){
                                horariosDispPorCama[siblingID] = horariosDispPorCama[siblingID].map((horario2aCama)=>{
                                    if(horario2aCama == cita.horariosMantener2aCama[0]){
                                        return `+${horario2aCama}`
                                    } else {
                                        return horario2aCama
                                    }
                                })
                            }
                        })
                    });

                    // // console.log(camaFamTree);
                    // console.log(citasPorCama[currentID]);
                    // console.log(horariosDispPorCama[currentID]);
                    // console.log(horariosDispPorCama[siblingID]);
                    // console.log("\n");
                });
                
                // TO DO:
                // ETA: 5 horas
                // Verificar si la cita recibida puede ser agendada
                // en el horario especificado.
                console.log(horariosDispPorCama);
                

                // TO DO:
                // ETA: 3 horas
                // AgendarCita()
                // res.status(201).json(req.body);
                res.status(201).json({});
                return;

                try {
                    const [result] = await connection.execute(
                        `INSERT INTO citas (id, clienta_id, servicio_id, lashista_id, fecha, hora, cama_id) 
                        VALUES (UUID(), '${cita.clienta_id}', '${cita.servicio_id}', '${cita.lashista_id}', '${cita.fecha}', '${cita.hora}', '${cita.cama_id}')`
                    );
                    if (result.affectedRows > 0) {
                        return res.status(201).json({
                            message: "Default cita inserted successfully",
                            id: result.insertId,
                        });
                    } else {
                        return res
                            .status(500)
                            .json({ error: "Failed to insert default cita" });
                    }
                } catch (insertError) {
                    return res.status(500).json({
                        error: "MySQL insertion failed",
                        details: insertError.message,
                    });
                }
            }

            const [year, month, day] = date.split("-");
            const formattedDate = `${day}-${month}-${year}`;

            // Assuming the date is in 'YYYY-MM-DD' format and the citas table has a 'date' column
            const [rows] = await connection.execute(
                `SELECT clientas.nombre_completo as clienta, servicios.servicio, servicios.id as servicio_id, servicios.minutos as duracion, fecha, hora, cama_id, lashistas.nombre as lashista 
                    FROM 
                      citas 
                    LEFT JOIN clientas ON citas.clienta_id = clientas.id
                    LEFT JOIN servicios ON citas.servicio_id = servicios.id
                    LEFT JOIN lashistas ON citas.lashista_id = lashistas.id
                    WHERE fecha = '${formattedDate}'`
            );
            res.status(200).json(rows);
        } else {
            // Handle unsupported methods
            res.status(405).json({ error: "Method not allowed" });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch citas",
            error: error,
        });
    } finally {
        await connection.end();
    }
}

function generarHorarioDelDia({ weekend = false }) {
    const startHour = 9;
    const endHour = weekend ? 14.5 : 17.5; // 14:30 or 17:30
    const workDayHours = [];

    for (let time = startHour; time <= endHour; time += 0.5) {
        const hour = Math.floor(time);
        const minute = time % 1 === 0 ? "00" : "30";
        workDayHours.push(`${hour.toString().padStart(2, "0")}:${minute}`);
    }

    return workDayHours;
}

/**
 * Retorna los horarios ocupados en cadad cama
 * @param {Object} horariosDeCama - Arreglo con todas las horas (sin filtrar) del dia
 * @param {string} horaCita - El horario de la cita que se quiere agendar
 * @param {Object} detallesServicio - Detalles del servicio
 * @returns {Array} - Arreglo con horarios ocupados
 */
// TO DO:
// Aplicar reglas de agenda por servicio
function getHorariosOcupadosPorServicio(
    horariosDeCama,
    detallesServicio,
    cita,
    servicios
) {
    const indexHoraCita = horariosDeCama.indexOf(cita.hora);
    const intervalosOcupados = detallesServicio.minutos / 30;
    const horariosOcupados = horariosDeCama.slice(
        indexHoraCita,
        indexHoraCita + intervalosOcupados
    );
    const reglasDeAgenda = JSON.parse(servicios[cita.servicio_id].regla);
    let horariosMantener = [];

    if (reglasDeAgenda.includes(0)) {
        horariosMantener.push(horariosOcupados[0]);
    }
    if (reglasDeAgenda.includes(-1)) {
        horariosMantener.push(horariosOcupados[horariosOcupados.length - 1]);
    }
    // if (reglasDeAgenda.includes(1)) {
    // }

    const response = {
        servicioID: cita.servicio_id,
        servicio: cita.servicio,
        horariosOcupados1aCama: horariosOcupados,
        horariosMantener2aCama: horariosMantener,
        /**
         * @type {ReglasDeServicio}
         */
        reglasDeServicio: reglasDeAgenda,
    };
    // console.log(response);
    return response;
}

/**
 * Returns a family tree object for a given bed, including current bed details and siblings.
 * @param {string[]} camasKeys - Array of bed identifiers.
 * @param {string} camaID - The ID of the current bed.
 * @param {number} loopIDX - The index of the current bed in camasKeys.
 * @returns {FamTree} - Object with current bed ID, its index, sibling bed IDs, and their indices.
 * @throws {Error} - If camaID or loopIDX is invalid.
 */
function getFamTree(camasKeys, camaID, loopIDX) {
    if (loopIDX < 0 || loopIDX >= camasKeys.length) {
        throw new Error(`Invalid loopIDX: ${loopIDX}`);
    }
    if (camasKeys[loopIDX] !== camaID) {
        throw new Error(
            `camaID "${camaID}" does not match camasKeys[${loopIDX}]`
        );
    }

    const siblings = camasKeys.filter((cama) => cama !== camaID);
    const siblingsIDX = camasKeys
        .map((cama, idx) => (cama !== camaID ? idx : -1))
        .filter((idx) => idx !== -1);

    return {
        current: camaID,
        currentIDX: loopIDX,
        siblings,
        siblingsIDX,
    };
}

/**
 * @typedef {Object} Servicio
 * @property {string} servicioID - Unique service identifier.
 * @property {string} servicio - Service name.
 * @property {string[]} horariosOcupados1aCama - Occupied time slots for first bed.
 * @property {string[]} horariosMantener2aCama - Reserved time slots for second bed.
 * @property {number[]} reglasDeServicio - Service rule IDs.
 */

/**
 * @typedef {Object} FamTree
 * @property {string} current - The ID of the current bed.
 * @property {number} currentIDX - The index of the current bed in the loop.
 * @property {string[]} siblings - Array of other bed IDs in the array being looped.
 * @property {number[]} siblingsIDX - Array of indices of other beds in the looping function.
 * @description Object representing the family tree of a bed in a looping context.
 */

/**
 * @typedef {number[]} ReglasDeServicio
 * @variation {[-1,0,1]}
 * @description Reglas de agenda:
 *  - -1: Se quita el último intervalo de horario (slot de media hora) de la cama no utilizada.
 *  -  0: Se mantiene disponible el primer slot horario de la cama utilizada en el servicio seleccionado.
 *  -  1: Se quitan todos los slots correspondientes a la cita.
 * @description Duración de cada slot: 30 minutos.
 * @example Ejemplo de slots horarios: ["10:00", "10:30"].
 */
