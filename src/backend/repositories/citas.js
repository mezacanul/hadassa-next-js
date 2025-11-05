import {
    parseQueryFilters,
    queryPlusFilters,
} from "@/utils/main";
// import connection from "../models/db";
import pool from "../models/db";

async function getByID(id) {
    const query = `SELECT 
            citas.id as cita_ID,
            servicios.image servicio_foto,
            lashistas.id as lashista_id, 
            lashistas.image as lashista_foto, 
            lashistas.nombre as lashista,
            citas.cama_id,
            servicios.servicio, 
            citas.fecha,
            citas.hora,
            citas.status,
            citas.metodo_pago,
            citas.fecha_pagado,
            citas.monto_pagado,
            citas.pagado,
            servicios.precio,
            servicios.minutos,
            servicios.id as servicio_id,
            servicios.precio_tarjeta,
            clientas.id as clienta_id, 
            clientas.foto_clienta, 
            clientas.nombres as clienta_nombres, 
            clientas.apellidos as clienta_apellidos, 
            clientas.lada, 
            clientas.telefono,
            clientas.detalles_cejas
        FROM 
            citas
        LEFT JOIN lashistas ON citas.lashista_id = lashistas.id
        LEFT JOIN clientas ON citas.clienta_id = clientas.id
        LEFT JOIN servicios ON citas.servicio_id = servicios.id
        WHERE citas.id = ?
    `;
    const [rows] = await pool.query(query, [id]);
    return rows;
}

async function getByClientaID(clientaId) {
    const query = `
        SELECT 
            citas.id,
            lashistas.nombre as lashista,
            servicios.servicio,
            citas.fecha, 
            citas.hora,
            citas.status,
            citas.pagado
        FROM citas
        LEFT JOIN servicios ON citas.servicio_id = servicios.id
        LEFT JOIN lashistas ON citas.lashista_id = lashistas.id
        WHERE clienta_id = ?
        ORDER BY 
            citas.fecha DESC,
            citas.hora DESC
    `;
    const [rows] = await pool.query(query, [clientaId]);
    return rows;
}

async function getByMultipleFilters(reqQuery) {
    const filterMap = {
        date: "fecha",
        lashista: "lashista_id",
        // cama: "cama_id",
        // hora: "hora"
    };
    let sqlQuery = `
        SELECT 
            citas.id as cita_ID, 
            fecha, 
            hora, 
            duracion,
            status,
            cama_id, 
            clientas.nombres, 
            clientas.apellidos, 
            clientas.foto_clienta as foto, 
            servicios.id as servicio_id, 
            servicios.servicio, 
            servicios.precio, 
            servicios.minutos as minutos, 
            lashistas.nombre as lashista,
            pagado,
            metodo_pago,
            monto_pagado,
            fecha_pagado,
            clientas.lada,
            clientas.telefono,
            en_servicio
        FROM 
            citas 
        LEFT JOIN clientas ON citas.clienta_id = clientas.id
        LEFT JOIN servicios ON citas.servicio_id = servicios.id
        LEFT JOIN lashistas ON citas.lashista_id = lashistas.id
    `;

    const { conditions, params } = parseQueryFilters(
        reqQuery,
        filterMap
    );

    let fullQuery = queryPlusFilters(sqlQuery, conditions);
    fullQuery = `${fullQuery} ORDER BY STR_TO_DATE(fecha, '%d-%m-%Y') DESC, lashista DESC, hora DESC`;

    const [rows] = await pool.query(fullQuery, params);
    console.log("repository", rows);
    return rows;
}

async function createCita(cita, uuid, hora) {
    try {
        const query = `
        INSERT INTO 
            citas 
                (id, 
                clienta_id, 
                servicio_id, 
                lashista_id, 
                fecha, 
                hora, 
                duracion, 
                cama_id, 
                status, 
                added
            ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;
        const [mysql_response] = await pool.query(query, [
            uuid,
            cita.clienta.id,
            cita.servicio.id,
            cita.lashista.id,
            cita.fecha,
            hora,
            cita.servicio.minutos,
            cita.horario.cama,
            // cita.metodoPago,
            1,
        ]);
        return mysql_response;
    } catch (error) {
        throw new Error(
            "MySQL insertion failed:",
            error.message
        );
    }
}

async function getCitasDelDiaByLashista(fecha, lashista) {
    const query = `
        SELECT 
            servicio_id, 
            servicios.servicio, 
            fecha, 
            hora, 
            duracion as minutos, 
            cama_id
        FROM 
            citas 
        LEFT JOIN clientas ON citas.clienta_id = clientas.id
        LEFT JOIN servicios ON citas.servicio_id = servicios.id
        LEFT JOIN lashistas ON citas.lashista_id = lashistas.id
        WHERE 
            fecha = ? 
        AND citas.lashista_id = ? 
        AND citas.status != 0
    `;
    const [rows] = await pool.query(query, [
        fecha,
        lashista,
    ]);
    return rows;
}

const citasRepository = {
    getByClientaID,
    getByID,
    getByMultipleFilters,
    createCita,
    getCitasDelDiaByLashista,
};

export default citasRepository;
