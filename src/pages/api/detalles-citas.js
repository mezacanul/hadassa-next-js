import mysql from "mysql2/promise";
import { parse, format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { getCurrentDateSpan } from "@/utils/detalles-citas";
import { db_info } from "@/config/db";

export default async function handler(req, res) {
    let query;
    let rows;

    const connection = await mysql.createConnection({
        host: db_info.host,
        port: db_info.port,
        user: db_info.user,
        password: db_info.password,
        database: db_info.database,
    });

    try {
        if (req.method === "GET") {
            let dateInfo = getCurrentDateSpan();
            let response;
            let params;
            let lashista;
            let dateSQLParams;

            switch (req.query.table) {
                case "lashistas":
                    query = "SELECT id, nombre, image as foto FROM lashistas";
                    [rows] = await connection.execute(query);
                    response = rows;
                    break;
                case "citas":
                    lashista = req.query.lashista;
                    dateSQLParams = getDateSQLParams(dateInfo);

                    switch (req.query.length) {
                        case "short":
                            query = `SELECT 
                                        SUM(CASE WHEN STR_TO_DATE(fecha, '%d-%m-%Y') >= STR_TO_DATE(?, '%d-%m-%Y') AND STR_TO_DATE(fecha, '%d-%m-%Y') <= STR_TO_DATE(?, '%d-%m-%Y') THEN 1 ELSE 0 END) as thisWeekCount,
                                        SUM(CASE WHEN STR_TO_DATE(fecha, '%d-%m-%Y') >= STR_TO_DATE(?, '%d-%m-%Y') THEN 1 ELSE 0 END) as futureCount
                                    FROM citas
                                    WHERE lashista_id = ? 
                                    AND STR_TO_DATE(fecha, '%d-%m-%Y') >= STR_TO_DATE(?, '%d-%m-%Y')
                                    AND status != 0`;
                            params = [
                                dateSQLParams.thisWeek.startDate,
                                dateSQLParams.thisWeek.endDate,
                                dateSQLParams.future.startDate,
                                lashista,
                                dateSQLParams.thisWeek.startDate,
                            ];
                            [rows] = await connection.execute(query, params);
                            response = {
                                lashista,
                                counts: {
                                    thisWeek: rows[0].thisWeekCount || 0,
                                    future: rows[0].futureCount || 0,
                                },
                                dateSQLParams,
                            };
                            break;
                        case "full":
                            switch (req.query.period) {
                                case "thisWeek":
                                    query = `SELECT 
                                                citas.*,
                                                clientas.nombres as clienta_nombres, 
                                                clientas.apellidos as clienta_apellidos, 
                                                servicios.servicio
                                            FROM 
                                                citas
                                            LEFT JOIN clientas ON citas.clienta_id = clientas.id
                                            LEFT JOIN servicios ON citas.servicio_id = servicios.id
                                            WHERE lashista_id = ? 
                                            AND STR_TO_DATE(citas.fecha, '%d-%m-%Y') BETWEEN STR_TO_DATE(?, '%d-%m-%Y') AND STR_TO_DATE(?, '%d-%m-%Y')
                                            ORDER BY STR_TO_DATE(citas.fecha, '%d-%m-%Y') DESC`;
                                    const paramsThisWeek = [
                                        lashista,
                                        dateSQLParams.thisWeek.startDate,
                                        dateSQLParams.thisWeek.endDate,
                                    ];
                                    const [rowsThisWeek] =
                                        await connection.execute(
                                            query,
                                            paramsThisWeek
                                        );
                                    response = {
                                        lashista,
                                        citas: rowsThisWeek,
                                        dateSQLParams,
                                    };
                                    break;
                                case "future":
                                    query = `SELECT 
                                                citas.*,
                                                clientas.nombres as clienta_nombres, 
                                                clientas.apellidos as clienta_apellidos, 
                                                servicios.servicio
                                            FROM 
                                                citas
                                            LEFT JOIN clientas ON citas.clienta_id = clientas.id
                                            LEFT JOIN servicios ON citas.servicio_id = servicios.id
                                            WHERE lashista_id = ? 
                                            AND STR_TO_DATE(citas.fecha, '%d-%m-%Y') >= STR_TO_DATE(?, '%d-%m-%Y')
                                            ORDER BY STR_TO_DATE(citas.fecha, '%d-%m-%Y') ASC`;
                                    const paramsFuture = [
                                        lashista,
                                        dateSQLParams.future.startDate,
                                    ];
                                    const [rowsFuture] =
                                        await connection.execute(
                                            query,
                                            paramsFuture
                                        );
                                    response = {
                                        lashista,
                                        citas: rowsFuture,
                                        dateSQLParams,
                                    };
                                    break;
                                case "past":
                                    query = `SELECT 
                                                citas.*,
                                                clientas.nombres as clienta_nombres, 
                                                clientas.apellidos as clienta_apellidos, 
                                                servicios.servicio
                                            FROM 
                                                citas
                                            LEFT JOIN clientas ON citas.clienta_id = clientas.id
                                            LEFT JOIN servicios ON citas.servicio_id = servicios.id
                                            WHERE lashista_id = ? 
                                            AND STR_TO_DATE(citas.fecha, '%d-%m-%Y') <= STR_TO_DATE(?, '%d-%m-%Y')
                                            ORDER BY STR_TO_DATE(citas.fecha, '%d-%m-%Y') DESC`;
                                    const paramsPast = [
                                        lashista,
                                        dateSQLParams.past.startDate,
                                    ];
                                    const [rowsPast] =
                                        await connection.execute(
                                            query,
                                            paramsPast
                                        );
                                    response = {
                                        lashista,
                                        citas: rowsPast,
                                        dateSQLParams,
                                    };
                                    break;
                                default:
                                    break;
                            }
                            break;
                        default:
                            break;
                    }
                    break;
            }

            // const [rows] = await connection.execute(query, params);
            res.status(200).json(response);
        } else if (req.method === "POST") {
            res.status(200).json(req.body);
        }
    } catch (error) {
        res.status(500).json({ error });
    } finally {
        await connection.end();
    }
}

function getDateSQLParams(dateInfo) {
    console.log(dateInfo);
    const [thisWeekStartDay, thisWeekStartMonth, thisWeekStartYear] =
        dateInfo.thisWeek.startDate.split("/");
    const [thisWeekEndDay, thisWeekEndMonth, thisWeekEndYear] =
        dateInfo.thisWeek.endDate.split("/");
    const [futureDay, futureMonth, futureYear] = dateInfo.future.split("/");
    const [pastDay, pastMonth, pastYear] = dateInfo.past.split("/");
    // const currentDate = new Date();
    // const year = format(currentDate, "yyyy");

    return {
        thisWeek: {
            startDate: `${thisWeekStartDay}-${thisWeekStartMonth}-${thisWeekStartYear}`,
            endDate: `${thisWeekEndDay}-${thisWeekEndMonth}-${thisWeekEndYear}`,
        },
        future: {
            startDate: `${futureDay}-${futureMonth}-${futureYear}`,
        },
        past: {
            startDate: `${pastDay}-${pastMonth}-${pastYear}`,
        },
    };
}
