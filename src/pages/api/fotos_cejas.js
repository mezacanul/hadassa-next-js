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
            if (req.query.clientaID) {
                const [rows] = await connection.execute(
                    `SELECT 
                        * 
                    FROM fotos_cejas 
                    WHERE id_clienta = ?`,
                    [req.query.clientaID]
                );
                res.status(200).json(rows);
            }
        } else if (req.method == "POST") {
            const { clientaID, fotos } = req.body;
            // res.status(200).json({ clientaID, fotos });
            // return;
            let inserted = [];

            for (const foto of fotos) {
                const [mysql_response] = await connection.execute(
                    `INSERT INTO fotos_cejas (id, id_clienta, foto) VALUES (UUID(), ?, ?)`,
                    [clientaID, foto.foto]
                );
                if (mysql_response.affectedRows > 0) {
                    inserted.push(foto); // Add successful foto object to inserted array
                } else {
                    console.log(`Insert failed for foto: ${foto.foto}`);
                }
            }

            if (inserted.length > 0) {
                res.status(201).json({
                    success: true,
                    inserted,
                });
            } else {
                res.status(500).json({ error });
            }

            // res.status(200).json({ clientaID, foto });
        }
    } catch (error) {
        res.status(500).json({ error });
    } finally {
        await connection.end();
    }
}
