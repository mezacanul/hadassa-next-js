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
        } else if (req.method === "POST") {
            // POST: Filter citas by date
            const { date } = req.body;

            // Validate date presence
            if (!date) {
                const cita = req.body;
                const parsedDate = parse(cita.fecha, "dd-MM-yyyy", new Date());
                const dayName = format(parsedDate, "eeee", { locale: enUS }); // Use 'eeee' for English

                // Assuming the date is in 'YYYY-MM-DD' format and the citas table has a 'date' column
                const [rows] = await connection.execute(
                    `SELECT clientas.nombre_completo as clienta, servicios.servicio, servicios.minutos as duracion, fecha, hora, cama_id, lashistas.nombre as lashista 
                                FROM 
                                  citas 
                                LEFT JOIN clientas ON citas.clienta_id = clientas.id
                                LEFT JOIN servicios ON citas.servicio_id = servicios.id
                                LEFT JOIN lashistas ON citas.lashista_id = lashistas.id
                                WHERE fecha = '${cita.fecha}'`
                );

                const citasPorCama = rows.reduce((acc, item) => {
                    const { cama_id } = item;
                    acc[cama_id] = acc[cama_id] || [];
                    acc[cama_id].push(item);
                    return acc;
                }, {});
                const horariosDelDia = generarHorarioDelDia(["Saturday", "Sunday"].includes(dayName))
                console.log(citasPorCama, horariosDelDia);
                // -- DEV: TODO
                // const HorariosDisponibles: filtrado por fecha, lashista y duracion del servicio
                
                // -- DEV: TODO
                // AgendarCita(): debe pasar filtros -> dia/horario, lashista, ... 

                res.status(200).json([citasPorCama, horariosDelDia]);
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
                `SELECT clientas.nombre_completo as clienta, servicios.servicio, servicios.minutos as duracion, fecha, hora, cama_id, lashistas.nombre as lashista 
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
        res.status(500).json({ error: "Failed to fetch citas" });
    } finally {
        await connection.end();
    }
}

function generarHorarioDelDia(weekend = false) {
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