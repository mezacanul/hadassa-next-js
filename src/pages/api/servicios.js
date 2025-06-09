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
        const [rows] = await connection.execute(
            "SELECT * FROM servicios ORDER BY precio ASC, minutos ASC"
        );
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error });
    } finally {
        await connection.end();
    }
}
