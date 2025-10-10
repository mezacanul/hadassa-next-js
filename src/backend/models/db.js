import mysql from "mysql2/promise";
import { dbConfig } from "../config/db";

const connection = await mysql.createConnection(dbConfig);

export default connection;
