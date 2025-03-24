// pages/api/lashistas.js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'hadassa' // Replace with your actual database name
  });

  try {
    // Query the lashistas table
    const [rows] = await connection.execute('SELECT * FROM lashistas');
    // Send the results as an array
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lashistas' });
  } finally {
    // Close the connection
    await connection.end();
  }
}