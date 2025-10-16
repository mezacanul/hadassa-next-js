// import connection from "../models/db";
import pool from "../models/db";

async function getById(id) {
    const query = `SELECT * FROM lashistas WHERE id = ?`;
    const [rows] = await pool.query(query, [id]);
    return rows;
}

const lashistasRepository = {
    getById,
};

export default lashistasRepository;
