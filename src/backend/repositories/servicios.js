// import connection from "../models/db";
import pool from "../models/db";

async function getAll(id) {
    const query = `
        SELECT 
            id, 
            servicio, 
            minutos, 
            reglas_agenda 
        FROM servicios
    `;
    const [rows] = await pool.query(query);
    return rows;
}

const serviciosRepository = {
    getAll,
};

export default serviciosRepository;
