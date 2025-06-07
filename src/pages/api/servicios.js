// pages/api/servicios.js
import mysql from "mysql2/promise";

export default async function handler(req, res) {
    const connection = await mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "",
        database: "hadassa", // Replace with your actual database name
    });

    try {
        const [rows] = await connection.execute(
            "SELECT * FROM servicios ORDER BY precio ASC, minutos ASC"
        );
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to load 'servicios' service" });
    } finally {
        await connection.end();
    }
}
