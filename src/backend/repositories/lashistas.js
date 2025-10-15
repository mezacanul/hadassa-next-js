import connection from "../models/db";

async function getById(id) {
    const query = `SELECT * FROM lashistas WHERE id = ?`;
    const [rows] = await connection.execute(query, [id]);
    return rows;
}

const lashistasRepository = {
    getById,
};

export default lashistasRepository;
