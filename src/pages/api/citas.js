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
            // POST: Agendar cita
            const { date } = req.body;

            // Validate date var presence in request
            if (!date) {
                // Se recibe desde POST el objeto con los
                // detalles de la CITA a agendar.
                const cita = req.body;

                // Obtenemos de la DB: Todos los eventos del dia
                // - EVENTOS: filtrados por fecha y lashista
                // - SERVICIOS: para comparar duracion y reglas
                const [eventos] = await connection.execute(
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
                const [servicios] = await connection.execute(
                    `SELECT id, servicio, minutos, reglas_agenda FROM servicios`
                );
                const detallesServicios = {};
                servicios.forEach((servicio) => {
                    detallesServicios[servicio.id] = {
                        minutos: servicio.minutos,
                        regla: servicio.reglas_agenda,
                    };
                });

                // Organizamos citas por cama (filtradas por lashista actual)
                const citasPorCama = eventos.reduce((acc, item) => {
                    const { cama_id } = item;
                    acc[cama_id] = acc[cama_id] || [];
                    acc[cama_id].push(item);
                    return acc;
                }, {});

                // Extraemos NOMBRE DEL DIA para obtener
                // HORARIOS completos del dia por cama.
                // (Fines de semana (S-D) tienen diferente horario)
                const parsedDate = parse(cita.fecha, "dd-MM-yyyy", new Date());
                const dayName = format(parsedDate, "eeee", { locale: enUS }); // Use 'eeee' for English
                const horariosDelDia = generarHorarioDelDia({
                    weekend: ["Saturday", "Sunday"].includes(dayName),
                });
                let horariosPorCama = {};
                Object.keys(citasPorCama).forEach((cama) => {
                    horariosPorCama[cama] = horariosDelDia;
                });

                // TO DO:
                // ETA: 5 horas
                // Reducir horariosPorCama despues de comparar
                // con horarios de citas (citasPorCama) y
                // eliminar horarios no disponibles.
                // (Aplicar reglas de servicio [-1] [0,-1] [1])
                
                // 1.- Loopeamos cada cama
                Object.keys(citasPorCama).forEach((cama) => {
                // 2.- Consultamos horarios ocupados en cada cama
                // const horariosOcupados = citasPorCama[cama].map(cita=>cita.hora)
                    const horariosOcupados = citasPorCama[cama].map((cita) =>
                        getHorariosOcupados(
                            horariosPorCama[cama],
                            cita.hora,
                            detallesServicios[cita.servicio_id],
                            cita,
                            cama
                        )
                    );
                // 3.- Extraemos horariosOcupados de los horariosPorCama
                // TO DO: 
                // Aplicar reglas de agenda especificas de cada servicio
                    horariosPorCama[cama] = horariosPorCama[cama].filter(
                        (horario) => {
                            return !horariosOcupados.flat().includes(horario);
                        }
                    );
                });
                res.status(201).json(horariosPorCama);

                // TO DO:
                // ETA: 5 horas
                // Verificar si la cita recibida puede ser agendada
                // en el horario especificado.

                // TO DO:
                // ETA: 3 horas
                // AgendarCita()
                return;
                // res.status(201).json(req.body);
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

// TO DO: 
// Aplicar reglas de agenda por servicio
function getHorariosOcupados(horarios, hora, detallesServicio) {
    const startIndex = horarios.indexOf(hora);
    const slotsToBlock = detallesServicio.minutos / 30;
    return horarios.slice(startIndex, startIndex + slotsToBlock);
}
