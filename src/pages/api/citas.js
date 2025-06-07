import mysql from "mysql2/promise";
import { parse, format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { parseQueryFilters, queryPlusFilters } from "@/utils/main";
import {
    generarHorarioDelDia,
    GenerarHorariosDisponibles,
    getAvailable,
    getCamaAgendar,
    getFamTree,
    getHorariosOcupadosPorServicio,
    getSlots,
    puedeAgendar,
} from "@/utils/disponibilidad";

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
            // Map query params to database columns
            // Also defining which filters are allowed (+ at parseQueryFilters)
            const filterMap = {
                date: "fecha",
                lashista: "lashista_id",
                // cama: "cama_id",
                // hora: "hora"
            };
            const { conditions, params } = parseQueryFilters(
                req.query,
                filterMap
            );
            console.log(conditions, params);

            let query = `SELECT clientas.nombres, clientas.apellidos, clientas.foto_clienta as foto, servicios.servicio, servicios.id as servicio_id, servicios.precio, servicios.minutos as duracion, fecha, hora, cama_id, lashistas.nombre as lashista 
                    FROM 
                      citas 
                    LEFT JOIN clientas ON citas.clienta_id = clientas.id
                    LEFT JOIN servicios ON citas.servicio_id = servicios.id
                    LEFT JOIN lashistas ON citas.lashista_id = lashistas.id`;
            let fullQuery = queryPlusFilters(query, conditions);
            fullQuery = `${fullQuery} ORDER BY STR_TO_DATE(fecha, '%d-%m-%Y') DESC, lashista DESC, hora DESC`

            const [rows] = await connection.execute(fullQuery, params);
            res.status(200).json(rows);
        } else if (req.method === "POST" && req.body.fecha) {
            // TO DO:
            // Separar responsabilidades de API:
            // citas en POST solo puede agendar citas
            // para horarios disponibles utilizaremos
            //     -> horarios?filtro=disponibles&fecha&hora
            if (req.body.action == "agendar") {
                const cita = req.body;
                try {
                    const [uuidResult] = await connection.execute(
                        `SELECT UUID() AS id`
                    );
                    const uuid = uuidResult[0].id;
                    const hora = cita.horario.hora
                        .replace("-", "")
                        .replace("+", "");

                    const [mysql_response] = await connection.execute(
                        `INSERT INTO citas (id, clienta_id, servicio_id, lashista_id, fecha, hora, cama_id, added) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
                        [
                            uuid,
                            cita.clienta.id,
                            cita.servicio.id,
                            cita.lashista.id,
                            cita.fecha,
                            hora,
                            cita.horario.cama,
                        ]
                    );
                    if (mysql_response.affectedRows > 0) {
                        res.status(201).json({
                            uuid,
                            inserted: mysql_response.affectedRows,
                        });
                    } else {
                        res.status(500).json({ error: "Not added" });
                    }
                } catch (insertError) {
                    return res.status(500).json({
                        error: "MySQL insertion failed",
                        details: insertError.message,
                    });
                }
            }

            // POST: Agendar cita
            // Detalles de la CITA a agendar.
            const POST_Data = req.body;
            const cita = {
                hora: req.body.hora ? req.body.hora : null,
                fecha: req.body.fecha,
                servicio_id: req.body.servicio_id ? req.body.servicio_id : null,
                lashista_id: req.body.lashista_id ? req.body.lashista_id : null,
                clienta_id: req.body.clienta_id ? req.body.clienta_id : null,
            };

            let citaDetalles = {};
            let lashista = {};
            let servicios = [];
            let camasKeys = [];
            let citasPorCama = [];
            let horariosDispPorCama = {};
            let disponibilidad = {};
            let camaDisponible = null;
            const parsedDate = parse(cita.fecha, "dd-MM-yyyy", new Date());
            const dayName = format(parsedDate, "eeee", { locale: enUS }); // Use 'eeee' for English
            const horarioDelDia = generarHorarioDelDia({
                weekend: ["Saturday", "Sunday"].includes(dayName),
            });

            // let citasDelDia = []

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
                Object.keys(item).forEach((prop) => (acc[prop] = item[prop]));
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

            // Asignamos Horarios Del Dia completos por cama
            // para mas adelante filtrar y eliminar los horarios ocupados por citas
            camasKeys.forEach(
                (camaID) => (horariosDispPorCama[camaID] = [...horarioDelDia])
            );

            if (citasDelDia.length > 0) {
                // Organizamos citas del dia por cama.
                // Para ello convertimos el arreglo "citasPorCama"
                // a Objeto { (n)camaID: [...citas] }
                // [] -> {}
                citasPorCama = citasDelDia.reduce((acc, item) => {
                    const { cama_id } = item;
                    acc[cama_id] = acc[cama_id] || [];
                    acc[cama_id].push(item);
                    return acc;
                }, {});

                // Reducir horariosDispPorCama despues de comparar
                // con horarios de citas (citasPorCama) y
                // eliminar horarios no disponibles.
                // (Aplicar reglas de servicio [-1] [0,-1] [1])
                horariosDispPorCama = GenerarHorariosDisponibles(
                    camasKeys,
                    citasPorCama,
                    horariosDispPorCama,
                    servicios,
                    horarioDelDia
                );
            }

            if (POST_Data.action == "getHorariosDisponibles") {
                const available = getAvailable(
                    horariosDispPorCama,
                    cita,
                    horarioDelDia,
                    servicios
                );
                // console.log(horariosDispPorCama);

                // res.status(200).json({horariosDispPorCama, cita});
                // res.status(200).json({horariosDispPorCama, available});
                res.status(200).json(available);
                return;
            } else {
                res.status(200).json("Something is missing here... 🛠️");
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
