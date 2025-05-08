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
                // POST: cita
                // Detalles de la CITA a agendar.
                const cita = req.body;
                let citaDetalles = {};
                let lashista = {};
                let servicios = [];
                let camasKeys = [];
                let citasPorCama = [];
                let horariosDispPorCama = {};
                let disponibilidad = {};
                let camaDisponible = null;
                // let citasDelDia = []
                const parsedDate = parse(cita.fecha, "dd-MM-yyyy", new Date());
                const dayName = format(parsedDate, "eeee", { locale: enUS }); // Use 'eeee' for English
                const horarioDelDia = generarHorarioDelDia({
                    weekend: ["Saturday", "Sunday"].includes(dayName),
                });

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

                [camasKeys] = await connection.execute(
                    `SELECT id FROM camas WHERE lashista_id = '${cita.lashista_id}'`
                );

                [lashista] = await connection.execute(
                    `SELECT * FROM lashistas WHERE id = '${cita.lashista_id}'`
                );

                camasKeys = camasKeys.map((cama) => cama.id);

                lashista = lashista.reduce((acc, item) => {
                    Object.keys(item).forEach((prop) => {
                        acc[prop] = item[prop];
                    });
                    return acc;
                }, {});

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

                citaDetalles = {
                    hora: cita.hora,
                    duracion: servicios[cita.servicio_id].minutos,
                    slots: getSlots(cita, horarioDelDia, servicios),
                    directiva: servicios[cita.servicio_id].regla,
                };

                if (citasDelDia.length > 0) {
                    // Object : citasPorCama
                    // Organizamos citas del dia por cama
                    citasPorCama = citasDelDia.reduce((acc, item) => {
                        const { cama_id } = item;
                        acc[cama_id] = acc[cama_id] || [];
                        acc[cama_id].push(item);
                        return acc;
                    }, {});

                    // console.log("citas array", citasDelDia.length);
                    // console.log("citas", Object.entries(citasDelDia));

                    // Object
                    // Asignamos horariosDispPorCama
                    camasKeys.forEach((camaID) => {
                        horariosDispPorCama[camaID] = horarioDelDia;
                    });

                    // Reducir horariosDispPorCama despues de comparar
                    // con horarios de citas (citasPorCama) y
                    // eliminar horarios no disponibles.
                    // (Aplicar reglas de servicio [-1] [0,-1] [1])

                    // 1.- Loopeamos por cada cama
                    camasKeys.forEach((camaID, IDX) => {
                        const famTree = getFamTree(camasKeys, camaID, IDX);
                        const currentID = famTree.current;
                        const siblingID = famTree.siblings[0];

                        // console.log(famTree, currentID, siblingID);
                        // console.log(citasPorCama[currentID] == null);
                        
                        // 2.- Asignamos servicios por cama { ...camaID's: ... }
                        if(citasPorCama[currentID]){
                            citasPorCama[currentID] = citasPorCama[currentID].map(
                                (cita) =>
                                    getHorariosOcupadosPorServicio(
                                        horariosDispPorCama[currentID],
                                        servicios[cita.servicio_id],
                                        cita,
                                        servicios
                                    )
                            );
                        } else {
                            citasPorCama[currentID] = []
                        }
                        
                        // 3.- Lopeamos cada cita
                        citasPorCama[currentID].forEach((cita) => {
                            // Loopeamos cada horario ocupado
                            cita.horariosOcupados1aCama.forEach(
                                (horarioOcupado1aCama, idx) => {
                                    // Eliminamos horario ocupado en primera cama
                                    horariosDispPorCama[currentID] =
                                        horariosDispPorCama[currentID].filter(
                                            (horario1aCama) => {
                                                return (
                                                    horarioOcupado1aCama !=
                                                    horario1aCama
                                                );
                                            }
                                        );

                                    // Eliminamos horario ocupado en segunda cama
                                    // si unica regla es [1]
                                    if (cita.reglasDeServicio[0] == 1) {
                                        horariosDispPorCama[siblingID] =
                                            horariosDispPorCama[
                                                siblingID
                                            ].filter((horario2aCama) => {
                                                return (
                                                    horarioOcupado1aCama !=
                                                    horario2aCama
                                                );
                                            });
                                    }

                                    // Mantenemos el primer horario del arreglo horariosMantener2aCama
                                    // si primera regla es [0]
                                    if (cita.reglasDeServicio[0] == 0) {
                                        horariosDispPorCama[siblingID] =
                                            horariosDispPorCama[siblingID].map(
                                                (horario2aCama) => {
                                                    if (
                                                        horario2aCama ==
                                                        cita
                                                            .horariosMantener2aCama[0]
                                                    ) {
                                                        return `+${horario2aCama}`;
                                                    } else {
                                                        return horario2aCama;
                                                    }
                                                }
                                            );
                                    }

                                    if (cita.reglasDeServicio.includes(-1)) {
                                        // Mantenemos el ultimo horario del arreglo horariosMantener2aCama
                                        // si se incluye regla [-1]
                                        horariosDispPorCama[siblingID] =
                                            horariosDispPorCama[siblingID].map(
                                                (horario2aCama) => {
                                                    if (
                                                        horario2aCama ==
                                                        cita
                                                            .horariosMantener2aCama[
                                                            cita
                                                                .horariosMantener2aCama
                                                                .length - 1
                                                        ]
                                                    ) {
                                                        return `-${horario2aCama}`;
                                                    } else {
                                                        return horario2aCama;
                                                    }
                                                }
                                            );

                                        // Eliminamos horario ocupado en segunda cama
                                        // si se incluye regla [-1]
                                        horariosDispPorCama[siblingID] =
                                            horariosDispPorCama[
                                                siblingID
                                            ].filter((horario2aCama) => {
                                                return (
                                                    horarioOcupado1aCama !=
                                                    horario2aCama
                                                );
                                            });
                                    }
                                }
                            );
                        });
                    });

                    camasKeys.forEach((camaID) => {
                        disponibilidad[camaID] = isSubArray(
                            horariosDispPorCama[camaID],
                            citaDetalles.slots,
                            citaDetalles.directiva
                        );
                    });
                } else {
                    camasKeys.forEach((camaID) => {
                        disponibilidad[camaID] = true;
                        horariosDispPorCama[camaID] = horarioDelDia;
                    });
                }

                const response = {
                    camaAgendar: getCamaAgendar(disponibilidad),
                    lashista,
                    fecha: cita.fecha,
                    hora: cita.hora,
                    disponibilidad,
                    citaDetalles,
                    horariosDispPorCama,
                };

                // TO DO:
                // ETA: 3 horas
                // AgendarCita()
                // res.status(201).json(req.body);
                console.log(response);
                res.status(201).json(response);
                return;

                try {
                    const [result] = await connection.execute(
                        `INSERT INTO citas (id, clienta_id, servicio_id, lashista_id, fecha, hora, cama_id) 
                        VALUES (UUID(), '${cita.clienta_id}', '${cita.servicio_id}', '${cita.lashista_id}', '${cita.fecha}', '${cita.hora}', '${camaDisponible}')`
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
    const startHour = 9.5;
    const endHour = weekend ? 14.5 : 17.5; // 14:30 or 17:30
    const workDayHours = [];

    for (let time = startHour; time <= endHour; time += 0.5) {
        const hour = Math.floor(time);
        const minute = time % 1 === 0 ? "00" : "30";
        workDayHours.push(`${hour.toString().padStart(2, "0")}:${minute}`);
    }

    return workDayHours;
}

function getCamaAgendar(disponibilidad) {
    const camasKeys = Object.keys(disponibilidad);
    const todasDisponibles = camasKeys.every((camaID) => {
        return disponibilidad[camaID] == true;
    });
    const noDisponible = camasKeys.every((camaID) => {
        return disponibilidad[camaID] == false;
    });
    if (todasDisponibles == true) {
        return camasKeys[0];
    } else if (noDisponible == true) {
        return null;
    } else {
        disponibilidad.forEach((camaID) => {
            if (disponibilidad[camaID] == true) {
                return camaID;
            }
        });
    }
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

function getSlots(cita, horarioDelDia, servicios) {
    const slotsCount = servicios[cita.servicio_id].minutos / 30;
    // TO DO:
    // Construir array de (slots * horarioDelDia)
    let count = { start: horarioDelDia.indexOf(cita.hora) };
    const citaSlots = horarioDelDia.slice(
        count.start,
        count.start + slotsCount
    );
    return citaSlots;
}

/**
 * Checks if subArray is a consecutive subarray of array.
 * @param {string[]} array - Main array (e.g., bed slots).
 * @param {string[]} subArray - Subarray to find (e.g., cita slots).
 * @returns {boolean} - True if subArray is a consecutive part of array.
 */
function isSubArray(array, subArray, directivaJSON) {
    const directiva = JSON.parse(directivaJSON);

    return array.some((_, i) =>
        array.slice(i, i + subArray.length).every((horario, horarioIdx) => {
            // console.log(horario, horarioIdx);
            // return horario === subArray[horarioIdx];

            if (directiva[0] == 0) {
                if (horarioIdx == 0) {
                    horario = horario.replace("-", "");
                } else if (horarioIdx == 1) {
                    horario = horario.replace("+", "");
                }
                return horario === subArray[horarioIdx];
            } else {
                return horario === subArray[horarioIdx];
            }
        })
    );
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
 *  - -1: Se mantiene el último intervalo de horario (slot de media hora) en la segunda cama con un signo de -.
 *  -  0: Se mantiene disponible el primer slot horario en la segunda cama.
 *  -  1: Se quitan todos los slots correspondientes a la cita en la segunda cama.
 * @description Duración de cada slot: 30 minutos.
 * @example Ejemplo de slots horarios: ["10:00", "10:30"].
 */
