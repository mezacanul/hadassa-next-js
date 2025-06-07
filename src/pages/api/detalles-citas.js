import mysql from "mysql2/promise";
import { parse, format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { getCurrentDateSpan } from "@/utils/detalles-citas";

export default async function handler(req, res) {
    const connection = await mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "",
        database: "hadassa",
    });

    try {
        if (req.method === "GET") {
            let response

            switch (req.query.action) {
                case "lashistas":
                    const query = "SELECT id, nombre, image as foto FROM lashistas"
                    const [rows] = await connection.execute(query);
                    response = rows
                    break;
                case "this-week":
                    response = getCurrentDateSpan()
                default:
                    break;
            }

            // const [rows] = await connection.execute(query, params);
            res.status(200).json(response);
        } else if (req.method === "POST") {
            res.status(200).json(req.body);
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch citas",
            error: error,
        });
    } finally {
        await connection.end();
    }
}
