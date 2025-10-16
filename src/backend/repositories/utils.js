// import connection from "../models/db";
import pool from "../models/db";

async function generateUUID() {
    const query = `SELECT UUID() AS id`;
    const [rows] = await pool.query(query);
    return rows;
}

async function getStudioHorarios() {
    const query = `
        SELECT
            *
        FROM cat_horarios
    `;
    const [rows] = await pool.query(query);
    return rows;
}

const utilsRepository = {
    generateUUID,
    getStudioHorarios,
};

export default utilsRepository;
