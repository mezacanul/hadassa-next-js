import pool from "../models/db";

async function getAll() {
    const query = `SELECT * FROM live_lugares`;
    const [rows] = await pool.query(query);
    return rows;
}

async function update(id, status) {
    const query = `
        UPDATE live_lugares
        SET status = ?
        WHERE id = ?
    `;
    const [result] = await pool.query(query, [status, id]);
    return result;
}

const liveRepository = {
    getAll,
    update,
};

export default liveRepository;
