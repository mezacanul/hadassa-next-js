// import mysql from "mysql2/promise";
// import { db_info } from "@/config/db";
import pool from "@/backend/models/db";
import { parse, format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import {
    formatFechaDMY,
    formatFechaYMD,
    getDayIndexNumber,
    getHorarioByDayNumber,
    getHorarioObject,
    getMinutes,
} from "@/utils/main";
import {
    generarHorarioDelDia,
    GenerarHorariosDisponibles,
    getAvailable,
    getEventSlots,
    getEventSlotsBackwards,
    refineHorarios,
    sortByHora,
} from "@/utils/disponibilidad";
import { filterTimeSlotsByRange } from "@/utils/detalles-citas";

import citasController from "@/backend/controllers/citas";
import {
    encodeHoraToFloat,
    horarioJSONToFullArray,
    horarioObjectToFullArray,
} from "@/utils/disponibilidad-v1.2";

export default async function handler(req, res) {
    try {
        if (req.method === "GET") {
            if (req.query.clienta) {
                console.log("GET BY CLIENTA");
                const rows =
                    await citasController.getByClientaID(
                        req
                    );
                res.status(200).json(rows);
            }
            if (req.query.id) {
                console.log("GET BY ID");
                const row = await citasController.getByID(
                    req
                );
                res.status(200).json(row);
            } else {
                console.log("TEST - MULTIPLE");
                const rows =
                    await citasController.getByMultipleFilters(
                        req
                    );
                res.status(200).json(rows);
            }
        } else if (
            req.method === "POST" &&
            req.body.fecha
        ) {
            if (req.body.action == "agendar") {
                // const cita = req.body;
                console.log("AGENDAR");
                const response =
                    await citasController.createCita(req);
                res.status(201).json(response);
            }

            // POST: Agendar cita
            // Detalles de la CITA a agendar.
            const POST_Data = req.body;
            const cita = {
                // hora: req.body.hora ? req.body.hora : null,
                fecha: req.body.fecha,
                servicio_id: req.body.servicio_id
                    ? req.body.servicio_id
                    : null,
                lashista_id: req.body.lashista_id
                    ? req.body.lashista_id
                    : null,
                // clienta_id: req.body.clienta_id ? req.body.clienta_id : null,
            };

            // let citaDetalles = {};
            let lashista = {};
            let servicios = [];
            let camasKeys = [];
            let citasPorCama = [];
            let horariosDispPorCama = {};
            // let disponibilidad = {};
            // let camaDisponible = null;
            let horarioLashista = [];
            const parsedDate = parse(
                cita.fecha,
                "dd-MM-yyyy",
                new Date()
            );
            const dayName = format(parsedDate, "eeee", {
                locale: enUS,
            }); // Use 'eeee' for English
            const horarioDelDia = generarHorarioDelDia({
                weekend: ["Saturday", "Sunday"].includes(
                    dayName
                ),
            });

            // let citasDelDia = []

            let [citasDelDia] = await pool.query(
                `SELECT 
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
                    WHERE fecha = '${cita.fecha}' AND citas.lashista_id = '${cita.lashista_id}' AND citas.status != 0`
                // Date format for CITAS table, FECHA column: 'YYYY-MM-DD'
            );
            [servicios] = await pool.query(
                `SELECT id, servicio, minutos, reglas_agenda FROM servicios`
            );
            [camasKeys] = await pool.query(
                `SELECT id FROM camas WHERE lashista_id = '${cita.lashista_id}'`
            );
            [lashista] = await pool.query(
                `SELECT * FROM lashistas WHERE id = '${cita.lashista_id}'`
            );

            let [eventos] = await pool.query(
                `SELECT 
                    *, 
                    lashistas.nombre as lashista
                FROM 
                    eventos 
                LEFT JOIN lashistas ON eventos.id_lashista = lashistas.id
                WHERE 
                    fecha_init = '${formatFechaYMD(
                        cita.fecha
                    )}'
                    AND id_lashista = '${cita.lashista_id}'
                    AND status = 1`
            );

            camasKeys = camasKeys.map((cama) => cama.id);
            lashista = lashista.reduce((acc, item) => {
                Object.keys(item).forEach(
                    (prop) => (acc[prop] = item[prop])
                );
                return acc;
            }, {});
            servicios = Object.fromEntries(
                servicios.map((servicio) => [
                    servicio.id,
                    {
                        servicio: servicio.servicio,
                        minutos: servicio.minutos,
                        regla: servicio.reglas_agenda,
                    },
                ])
            );

            // console.log("eventos before", eventos);
            eventos = formatEventosForAvailableCalculation(
                eventos,
                lashista,
                formatFechaYMD(cita.fecha)
            );
            console.log("eventos after", eventos);

            horarioLashista = [
                "Saturday",
                "Sunday",
            ].includes(dayName)
                ? lashista.horarioSBD
                : lashista.horarioLV;

            let horarioLashistaArray =
                filterTimeSlotsByRange(
                    horarioDelDia,
                    horarioLashista
                );

            if (eventos.length > 0) {
                let eventoHorarios = eventos[0].horarios;
                switch (eventos[0].tipo) {
                    case "cambio-horario":
                        horarioLashistaArray =
                            horarioJSONToFullArray(
                                eventoHorarios
                            );
                        break;
                    case "dia-libre":
                        res.status(200).json([]);
                        return;
                    default:
                        break;
                }
            }
            console.log(
                "horarioLashistaArray",
                horarioLashistaArray
            );

            // horarioDelDia = filterTimeSlotsByRange(horarioDelDia, horarioLashista)
            // console.log(lashista.nombre, {horarioDelDia, lashista});
            // console.log("Filtrado", filterTimeSlotsByRange(horarioDelDia, horarioLashista));

            // citaDetalles = {
            //     hora: cita.hora,
            //     duracion: servicios[cita.servicio_id].minutos,
            //     slots: getSlots(cita, horarioDelDia, servicios),
            //     directiva: servicios[cita.servicio_id].regla,
            // };

            // Asignamos Horarios Del Dia completos por cama
            // para mas adelante filtrar y eliminar los horarios ocupados por citas
            camasKeys.forEach(
                // (camaID) => (horariosDispPorCama[camaID] = [...horarioDelDia])
                (camaID) =>
                    (horariosDispPorCama[camaID] = [
                        ...horarioLashistaArray,
                    ])
            );

            if (citasDelDia.length > 0) {
                // Organizamos citas del dia por cama.
                // Para ello convertimos el arreglo "citasPorCama"
                // a Objeto { (n)camaID: [...citas] }
                // [] -> {}
                citasPorCama = citasDelDia.reduce(
                    (acc, item) => {
                        const { cama_id } = item;
                        acc[cama_id] = acc[cama_id] || [];
                        acc[cama_id].push(item);
                        return acc;
                    },
                    {}
                );

                // Reducir horariosDispPorCama despues de comparar
                // con horarios de citas (citasPorCama) y
                // eliminar horarios no disponibles.
                // (Aplicar reglas de servicio [-1] [0,-1] [1])
                horariosDispPorCama =
                    GenerarHorariosDisponibles(
                        camasKeys,
                        citasPorCama,
                        horariosDispPorCama,
                        servicios,
                        horarioDelDia
                    );
            }

            if (
                POST_Data.action ==
                    "getHorariosDisponibles" &&
                req.body.dev
            ) {
                const available = getAvailable(
                    horariosDispPorCama,
                    cita,
                    horarioDelDia,
                    servicios,
                    req.body.dev
                );
                // console.log("available", available);

                let availableArr = refineHorarios(
                    available,
                    camasKeys
                );
                availableArr = sortByHora(availableArr);

                if (eventos.length > 0) {
                    const evento = eventos[0];
                    if (evento.tipo != "cambio-horario") {
                        const eventSlots = getEventSlots(
                            evento.hora,
                            evento.minutos
                        );
                        const minutosCita =
                            servicios[cita.servicio_id]
                                .minutos;
                        const eventSlotsBackwards =
                            getEventSlotsBackwards(
                                evento.hora,
                                minutosCita
                            );

                        // console.log(availableArr, servicios[cita.servicio_id], eventSlotsBackwards);

                        availableArr = availableArr.filter(
                            (available) => {
                                return !eventSlots.includes(
                                    available.hora
                                );
                            }
                        );
                        availableArr = availableArr.filter(
                            (available) => {
                                return !eventSlotsBackwards.includes(
                                    available.hora
                                );
                            }
                        );
                    }
                }

                console.log("TEST - YES DEV");
                // console.log();
                // eventos,
                // servicios[cita.servicio_id],
                // availableArr
                // horariosDispPorCama
                // citasDelDia[0],
                // lashista

                // Final response
                res.status(200).json(availableArr);
            } else if (
                POST_Data.action == "getHorariosDisponibles"
            ) {
                const available = getAvailable(
                    horariosDispPorCama,
                    cita,
                    horarioDelDia,
                    servicios
                );

                console.log("TEST - NO DEV");

                // Final response
                res.status(200).json(available);
            } else {
                res.status(200).json(
                    "Something is missing here... 🛠️"
                );
            }
        } else {
            // Handle unsupported methods
            res.status(405).json({ error });
        }
    } catch (error) {
        res.status(500).json(error);
    } finally {
        // Close the connection to prevent connection leaks
        // await connection.end();
    }
}

function formatEventosForAvailableCalculation(
    eventos,
    lashista,
    fecha
) {
    const dayNumber = getDayIndexNumber(fecha);
    const horario = getHorarioByDayNumber(
        lashista,
        dayNumber
    );

    return eventos.map((ev) => ({
        servicio_id: ev.tipo,
        servicio: ev.titulo,
        fecha: formatFechaDMY(ev.fecha_init),
        hora: ev.hora_init ? ev.hora_init : horario[0],
        minutos: ev.hora_fin
            ? getMinutes(ev.hora_init, ev.hora_fin)
            : getMinutes(horario[0], horario[1]),
        cama_id: `cama-${ev.lashista.toLowerCase()}-1`,
        tipo: ev.tipo,
        horarios: ev.horarios,
    }));
}
