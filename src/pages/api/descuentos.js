// pages/api/servicios.js
import mysql from "mysql2/promise";
import { db_info } from "@/config/db";

export default async function handler(req, res) {
    const connection = await mysql.createConnection(
        db_info
    );

    try {
        if (req.method == "POST") {
            const { clienta, servicio } = req.body;
            const [rows] = await connection.execute(
                `SELECT
                    *
                FROM citas
                WHERE 
                    clienta_id = ? AND
                    servicio_id = ? AND 
                    pagado = 1`,
                [
                    clienta,
                    servicio
                ]
            );
            res.status(200).json(rows);
            // res.status(200).json({clienta, servicio});
        }
    } catch (error) {
        res.status(500).json({ error });
    } finally {
        await connection.end();
    }
}
