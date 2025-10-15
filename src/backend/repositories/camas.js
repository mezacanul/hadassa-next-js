import connection from "../models/db";

async function getCamasIDsByLashista(lashista) {
    const query = `SELECT id FROM camas WHERE lashista_id = ?`;
    const [rows] = await connection.execute(query, [
        lashista,
    ]);
    return rows;
}

const camasRepository = {
    getCamasIDsByLashista,
};

export default camasRepository;
