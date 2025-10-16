// pages/api/servicios.js
// import mysql from "mysql2/promise";
// import { db_info } from "@/config/db";
import pool from "@/backend/models/db";

export default async function handler(req, res) {
    // const connection = await mysql.createConnection(
    //     db_info
    // );

    try {
        if (req.method == "GET") {
            const [rows] = await pool.query(
                `SELECT
                    *
                FROM cat_horarios`,
                []
            );
            res.status(200).json(rows);
            // res.status(200).json({clienta, servicio});
        }
    } catch (error) {
        res.status(500).json({ error });
    } finally {
        //await connection.end();
    }
}
