// pages/api/citas/[id].js
import mysql from "mysql2/promise";
import { db_info } from "@/config/db";

const dbConfig = {
    host: db_info.host,
    port: db_info.port,
    user: db_info.user,
    password: db_info.password,
    database: db_info.database,
};

export default async function handler(req, res) {
    const id = req.query.id;
    let connection;
    let query;
    let result;

    try {
        connection = await mysql.createConnection(dbConfig);

        if (req.method == "GET") {
            const [rows] = await connection.execute(
                "SELECT * FROM clientas WHERE id = ?",
                [id]
            );
            res.status(200).json(rows);
        }
        if (req.method == "PATCH") {
            if (req.body.type == "batch") {
                const { payload } = req.body;
                query = `UPDATE clientas SET nombres = ?, apellidos = ?, lada = ?, telefono = ? WHERE id = ?`;
                [result] = await connection.execute(query, [
                    payload.nombres,
                    payload.apellidos,
                    payload.lada,
                    payload.telefono,
                    id,
                ]);
                res.status(200).json({
                    success: true,
                    affectedRows: result.affectedRows,
                });

                // res.status(200).json(req.body.payload);
            } else {
                const { column, value } = req.body; // Use req.body for PATCH payload
                // res.status(200).json({id, column, value})
                // return

                switch (column) {
                    case "detalles_cejas":
                        query = `UPDATE clientas SET detalles_cejas = ? WHERE id = ?`;
                        [result] = await connection.execute(query, [value, id]);
                        break;
                    case "foto_clienta":
                        query = `UPDATE clientas SET foto_clienta = ? WHERE id = ?`;
                        [result] = await connection.execute(query, [value, id]);
                        break;
                    default:
                        break;
                }

                if (result.affectedRows === 0) {
                    return res
                        .status(404)
                        .json({ error: "Clienta not found or no change" });
                }

                res.status(200).json({
                    success: true,
                    affectedRows: result.affectedRows,
                });
            }
        }
    } catch (error) {
        console.error("Error:", error); // Debug
        res.status(500).json({ error });
    } finally {
        if (connection) await connection.end(); // Close connection
    }
}
