import mysql from "mysql2/promise";

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
            // GET: Return all citas
            const [rows] = await connection.execute("SELECT * FROM citas");
            res.status(200).json(rows);
        } else if (req.method === "POST") {
            // POST: Filter citas by date
            const { date } = req.body;
            // Validate date presence
            if (!date) {
                return res.status(400).json({ error: "A date is required" });
            }
            const [year, month, day] = date.split("-");
            const formattedDate = `${day}-${month}-${year}`;

            // Assuming the date is in 'YYYY-MM-DD' format and the citas table has a 'date' column
            const [rows] = await connection.execute(
                `SELECT clientas.segundo_nombre as clienta, servicios.servicio, servicios.minutos as duracion, fecha, hora, cama_id, lashistas.nombre as lashista 
FROM 
	citas 
LEFT JOIN clientas ON citas.clienta_id = clientas.id
LEFT JOIN servicios ON citas.servicio_id = servicios.id
LEFT JOIN lashistas ON citas.lashista_id = lashistas.id
WHERE fecha = '${formattedDate}'`
            );
            res.status(200).json(rows);
        } else {
            // Handle unsupported methods
            res.status(405).json({ error: "Method not allowed" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch citas" });
    } finally {
        await connection.end();
    }
}
