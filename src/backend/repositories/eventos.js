// import connection from "../models/db";
import pool from "../models/db";

async function getByFechaAndLashista(fecha, lashista) {
    const query = `
        SELECT 
            *, 
            lashistas.nombre as lashista
        FROM 
            eventos 
        LEFT JOIN lashistas ON eventos.id_lashista = lashistas.id
        WHERE 
            fecha_init = ?
            AND id_lashista = ?
            AND status = 1
    `;
    const [rows] = await pool.query(query, [
        fecha,
        lashista,
    ]);
    return rows;
}

const eventosRepository = {
    getByFechaAndLashista,
};

export default eventosRepository;
