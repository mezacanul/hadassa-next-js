// pages/api/servicios.js
import mysql from "mysql2/promise";
import { db_info } from "@/config/db";

export default async function handler(req, res) {
    const connection = await mysql.createConnection({
        host: db_info.host,
        port: db_info.port,
        user: db_info.user,
        password: db_info.password,
        database: db_info.database,
    });

    try {
        if (req.method == "GET") {
            if (req.query.id) {
                const [rows] = await connection.execute(
                    "SELECT * FROM servicios WHERE id = ?",
                    [req.query.id]
                );
                res.status(200).json(rows[0]);
            }
        }
        if (req.method == "PATCH") {
            if (req.body.type == "batch") {
                const { payload } = req.body;
                // res.status(200).json({
                //     title: payload.title,
                //     descripcion: payload.descripcion,
                //     minutos: payload.minutos,
                //     precio: payload.precio,
                //     precioTarjeta: payload.precioTarjeta,
                //     id: req.query.id,
                // });
                // return

                // const { payload } = req.body;
                let query = `UPDATE 
                            servicios 
                        SET 
                            servicio = ?, 
                            descripcion = ?, 
                            minutos = ?, 
                            precio_tarjeta = ?, 
                            precio = ? 
                        WHERE 
                            id = ?`;
                let [result] = await connection.execute(query, [
                    payload.title,
                    payload.descripcion,
                    payload.minutos,
                    payload.precio,
                    payload.precioTarjeta,
                    req.query.id,
                ]);
                res.status(200).json({
                    success: true,
                    affectedRows: result.affectedRows,
                });

                // res.status(200).json(req.body.payload);
            } else if (req.query.id) {
                const { id } = req.query;
                const { column, value } = req.body;
                // res.status(200).json({id, column, value });

                switch (column) {
                    case "image":
                        let query = `UPDATE servicios SET image = ? WHERE id = ?`;
                        let [result] = await connection.execute(query, [
                            value,
                            id,
                        ]);

                        res.status(200).json({
                            success: true,
                            affectedRows: result.affectedRows,
                        });
                        break;
                    default:
                        break;
                }
            }
        }
    } catch (error) {
        res.status(500).json({ error });
    } finally {
        await connection.end();
    }
}
