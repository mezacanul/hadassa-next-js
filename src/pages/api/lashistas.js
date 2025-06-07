// pages/api/lashistas.js
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
        // Query the lashistas table
        const [rows] = await connection.execute(
            "SELECT * FROM lashistas ORDER BY nombre ASC"
        );
        // Send the results as an array
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch lashistas" });
    } finally {
        // Close the connection
        await connection.end();
    }
}
