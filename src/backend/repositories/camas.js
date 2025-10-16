// import connection from "../models/db";
import pool from "../models/db";

async function getCamasIDsByLashista(lashista) {
    const query = `SELECT id FROM camas WHERE lashista_id = ?`;
    const [rows] = await pool.query(query, [lashista]);
    return rows;
}

const camasRepository = {
    getCamasIDsByLashista,
};

export default camasRepository;
