import pool from "@/backend/models/db";

export default async function handler(req, res) {
    let query;
    let result;

    try {
        if (req.method == "PATCH") {
            const id = req.query.id;
            const { column, value } = req.body; // Use req.body for PATCH payload

            switch (column) {
                case "status":
                    query = `UPDATE 
                                citas 
                            SET 
                                status = ? 
                            WHERE id = ?`;
                    [result] = await pool.query(query, [
                        value,
                        id,
                    ]);
                    break;
                case "pagado":
                    query = `UPDATE 
                                citas 
                            SET 
                                pagado = ?, 
                                fecha_pagado = NOW(),
                                metodo_pago = ?,
                                monto_pagado = ?,
                                status = 2
                            WHERE 
                                id = ?`;
                    [result] = await pool.query(query, [
                        value,
                        req.body.metodoPago,
                        req.body.precio,
                        id,
                    ]);
                    break;
                case "cama_id":
                    query = `UPDATE 
                                citas 
                            SET 
                                cama_id = ? 
                            WHERE 
                                id = ?`;
                    [result] = await pool.query(query, [
                        value,
                        id,
                    ]);
                    break;
                case "en_servicio":
                    query = `UPDATE 
                                citas 
                            SET 
                                en_servicio = ? 
                            WHERE 
                                id = ?`;
                    [result] = await pool.query(query, [
                        value,
                        id,
                    ]);
                    break;
                default:
                    break;
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: "Cita not found or no change",
                });
            }

            res.status(200).json({
                success: true,
                affectedRows: result.affectedRows,
            });
        }
    } catch (error) {
        console.error("Error:", error); // Debug
        res.status(500).json({ error });
    }
}
