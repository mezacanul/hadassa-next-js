// pages/api/clientas.js
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
        if (req.method === "GET") {
            const [rows] = await connection.execute("SELECT * FROM clientas");
            res.status(200).json(rows);
        } else if (req.method === "POST") {
            const nueva_clienta = req.body;

            const [uuidResult] = await connection.execute(
                `SELECT UUID() AS id`
            );
            const uuid = uuidResult[0].id;

            const [mysql_response] = await connection.execute(
                `INSERT INTO
                      clientas (id, nombres, apellidos, lada, telefono, fecha_agregado)
                  VALUES (?, ?, ?, ?, ?, NOW())`,
                [
                    uuid,
                    nueva_clienta.nombres,
                    nueva_clienta.apellidos,
                    nueva_clienta.lada,
                    nueva_clienta.telefono,
                ]
            );
            if (mysql_response.affectedRows > 0) {
                res.status(201).json({
                    uuid,
                    inserted: mysql_response.affectedRows,
                });
            } else {
                res.status(500).json({ error: "Not added" });
            }
        }
    } catch (error) {
        res.status(500).json({ error });
    } finally {
        // Close the connection
        await connection.end();
    }
}
