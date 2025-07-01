// pages/api/clientas.js
import mysql from "mysql2/promise";
import { db_info } from "@/config/db";
import { toZonedTime, format } from "date-fns-tz";

const timeZone = "America/Mexico_City";
const today = format(
    toZonedTime(new Date(), timeZone),
    "yyyy-MM-dd"
);

export default async function handler(req, res) {
    const connection = await mysql.createConnection(
        db_info
    );

    try {
        if (req.method === "GET") {
            if (req.query.lashista) {
                const { lashista } = req.query;
                const [rows] = await connection.execute(
                    `SELECT 
                        * 
                    FROM 
                        eventos 
                    WHERE 
                        id_lashista = ?
                        AND fecha_init >= ?
                    ORDER BY status DESC, fecha_init ASC`,
                    [lashista, today]
                );
                res.status(200).json(rows);
            }

            if (req.query.fecha) {
                const { fecha } = req.query;
                const [rows] = await connection.execute(
                    `SELECT 
                        * 
                    FROM 
                        eventos 
                    WHERE 
                        fecha_init = ?
                        AND status = 1`,
                    [fecha]
                );
                res.status(200).json(rows);
            }
        }

        if (req.method === "PATCH") {
            const eventoID = req.query.id;
            // res.status(200).json({
            //     success: true,
            //     eventoID
            // });
            // return

            let query =
                "UPDATE eventos SET status = 0 WHERE id = ?";
            let [result] = await connection.execute(query, [
                eventoID,
            ]);
            if (result.affectedRows > 0) {
                res.status(200).json({
                    success: true,
                    affectedRows: result.affectedRows,
                    eventoID,
                });
            } else {
                res.status(200).json({
                    success: false,
                    affectedRows: 0,
                    eventoID,
                });
            }
        }

        if (req.method === "POST") {
            const nuevo_evento = req.body;
            const { tipo } = nuevo_evento;
            const [uuidResult] = await connection.execute(
                `SELECT UUID() AS id`
            );
            const uuid = uuidResult[0].id;
            let mysql_response;
            let sql;

            switch (nuevo_evento.tipo) {
                case "horas-libres":
                    sql = `INSERT INTO eventos 
                            (
                                id, 
                                titulo,
                                notas,
                                fecha_init,
                                hora_init,
                                hora_fin,
                                id_lashista,
                                tipo,
                                status
                            )
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                    [mysql_response] =
                        await connection.execute(sql, [
                            uuid,
                            nuevo_evento.titulo,
                            nuevo_evento.notas,
                            nuevo_evento.fecha_init,
                            nuevo_evento.hora_init,
                            nuevo_evento.hora_fin,
                            nuevo_evento.lashistaID,
                            nuevo_evento.tipo,
                            1,
                        ]);
                    break;
                case "dia-libre":
                    sql = `INSERT INTO eventos 
                            (
                                id, 
                                titulo,
                                notas,
                                fecha_init,
                                id_lashista,
                                tipo,
                                status
                            )
                        VALUES (?, ?, ?, ?, ?, ?, ?)`;
                    [mysql_response] =
                        await connection.execute(sql, [
                            uuid,
                            nuevo_evento.titulo,
                            nuevo_evento.notas,
                            nuevo_evento.fecha_init,
                            nuevo_evento.lashistaID,
                            nuevo_evento.tipo,
                            1,
                        ]);
                    break;
                case "temporada-libre":
                    sql = `INSERT INTO eventos 
                            (
                                id, 
                                titulo,
                                notas,
                                fecha_init,
                                fecha_fin,
                                id_lashista,
                                tipo,
                                status
                            )
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                    [mysql_response] =
                        await connection.execute(sql, [
                            uuid,
                            nuevo_evento.titulo,
                            nuevo_evento.notas,
                            nuevo_evento.fecha_init,
                            nuevo_evento.fecha_fin,
                            nuevo_evento.lashistaID,
                            nuevo_evento.tipo,
                            1,
                        ]);
                    break;
                default:
                    break;
            }

            if (mysql_response.affectedRows > 0) {
                res.status(201).json({
                    uuid,
                    inserted: mysql_response.affectedRows,
                });
            } else {
                res.status(500).json({ error });
            }
        }
    } catch (error) {
        res.status(500).json({ error });
    } finally {
        // Close the connection
        await connection.end();
    }
}
