// pages/api/servicios.js
import mysql from "mysql2/promise";
import { db_info } from "@/config/db";

export default async function handler(req, res) {
    const connection = await mysql.createConnection(db_info);

    try {
        if(req.method == "GET"){
            if(req.query.lashista){
                const [rows] = await connection.execute(
                    `SELECT 
                        camas.id,
                        camas.lashista_id,
                        lashistas.nombre as lashista
                    FROM 
                        camas 
                    LEFT JOIN 
                        lashistas ON camas.lashista_id = lashistas.id
                    WHERE lashista_id = ?`,
                    [req.query.lashista]
                );
                res.status(200).json(rows);
            } else {
                const [rows] = await connection.execute(
                    "SELECT camas.id, lashistas.nombre as title, lashistas.image as src from camas LEFT JOIN lashistas ON camas.lashista_id = lashistas.id"
                );
                res.status(200).json(rows);
            }
        }
    } catch (error) {
        res.status(500).json({ error });
    } finally {
        await connection.end();
    }
}
