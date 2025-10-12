import connection from "../models/db";

async function getAll(id) {
    const query = `
        SELECT 
            id, 
            servicio, 
            minutos, 
            reglas_agenda 
        FROM servicios
    `;
    const [rows] = await connection.execute(query);
    return rows;
}

export default {
    getAll,
};
