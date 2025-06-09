import mysql from "mysql2/promise";
import { parse, format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { getCurrentDateSpan } from "@/utils/detalles-citas";
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
        if (req.method === "GET") {
            let response;

            switch (req.query.action) {
                case "lashistas":
                    const query =
                        "SELECT id, nombre, image as foto FROM lashistas";
                    const [rows] = await connection.execute(query);
                    response = rows;
                    break;
                case "this-week":
                    response = getCurrentDateSpan();
                default:
                    break;
            }

            // const [rows] = await connection.execute(query, params);
            res.status(200).json(response);
        } else if (req.method === "POST") {
            res.status(200).json(req.body);
        }
    } catch (error) {
        res.status(500).json({ error });
    } finally {
        await connection.end();
    }
}
