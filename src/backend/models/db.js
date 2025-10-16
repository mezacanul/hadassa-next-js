import mysql from "mysql2/promise";
import { dbConfig } from "../config/db";

// Create a connection pool to reuse connections efficiently
const pool = mysql.createPool({
    ...dbConfig,
    connectionLimit: 10,
    queueLimit: 0,
    waitForConnections: true,
});

export default pool;
