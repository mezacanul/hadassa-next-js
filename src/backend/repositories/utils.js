import connection from "../models/db";

async function generateUUID() {
    const query = `SELECT UUID() AS id`;
    const [rows] = await connection.execute(query);
    return rows;
}

export default {
    generateUUID,
};
