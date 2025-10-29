import { es } from "date-fns/locale"; // Spanish locale
import {
    format,
    parse,
    getDay,
    addMinutes,
} from "date-fns";
import { toZonedTime } from "date-fns-tz";

function formatHoyTitle(date) {
    if (date == null) return date;
    // console.log("hoy title", date);
    // const gmtString = date.date.marker.toGMTString(); // e.g., "Thu, 04 Apr 2025 00:00:00 GMT"

    const gmtString = new Date(date).toGMTString(); // e.g., "Thu, 04 Apr 2025 00:00:00 GMT"
    const parts = gmtString.split(" ");
    const day = parts[1]; // "04"
    const month = parts[2]; // "Apr"
    const year = parts[3]; // "2025"

    // Map English month abbreviations to Spanish
    const monthMap = {
        Jan: "Enero",
        Feb: "Febrero",
        Mar: "Marzo",
        Apr: "Abril",
        May: "Mayo",
        Jun: "Junio",
        Jul: "Julio",
        Aug: "Agosto",
        Sep: "Septiembre",
        Oct: "Octubre",
        Nov: "Noviembre",
        Dec: "Diciembre",
    };

    const spanishMonth = monthMap[month];
    return `${parseInt(day)} de ${spanishMonth} de ${year}`; // "4 de Abril de 2025"
}

function formatFechaDMY(fecha) {
    const [year, month, day] = fecha.split("-");
    return `${day}-${month}-${year}`;
}

function formatFechaYMD(fecha) {
    const [day, month, year] = fecha.split("-");
    return `${year}-${month}-${day}`;
}

function queryPlusFilters(query, conditions) {
    let fullQuery = query;
    if (conditions.length > 0) {
        fullQuery +=
            " WHERE " +
            (conditions.length > 1
                ? conditions.join(" AND ")
                : conditions[0]);
    }

    return `${fullQuery} AND citas.status != 0`;
}

// Function to parse req.query and build conditions
function parseQueryFilters(query, filterMap) {
    const conditions = [];
    const params = [];

    // Loop through query params
    for (const [key, value] of Object.entries(query)) {
        // Only include if key is in filterMap and value exists
        if (filterMap[key] && value) {
            // Custom date formatting
            const sendValue =
                key == "date"
                    ? formatFechaDMY(value)
                    : value;

            conditions.push(`${filterMap[key]} = ?`);
            params.push(sendValue);
        }
    }

    return { conditions, params };
}

function formatCamaID(camaID) {
    // console.log(camaID.split("-"));

    const camaArray = camaID.split("-");
    return `${capitalizeFirst(camaArray[0])} ${
        camaArray[2]
    }`;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getDateObject(selectedDate) {
    const parsedDate = parse(
        selectedDate,
        "yyyy-MM-dd",
        new Date()
    );

    const obj = {
        dayName: capitalizeFirst(
            format(parsedDate, "EEEE dd", { locale: es })
        ), // "Jueves 19"
        monthYearFormat: capitalizeFirst(
            format(parsedDate, "MMMM 'de' yyyy", {
                locale: es,
            })
        ), // "Junio de 2025"
    };
    return obj;
}

function formatHorario(horario) {
    const horarioArr = horario.split("-");
    return `${horarioArr[0]} a ${horarioArr[1]}`;
}

function getFechaLocal(fecha) {
    const timeZone = "America/Mexico_City";
    const fecha_zoned = toZonedTime(
        new Date(`${fecha}T00:00:00`),
        timeZone
    );
    const formatted = format(
        new Date(fecha_zoned),
        "EEEE dd 'de' MMMM",
        { locale: es }
    );
    return capitalizeFirst(formatted);
}

function formatEventType(type) {
    const strArr = type.split("-");
    return `${capitalizeFirst(strArr[0])} ${capitalizeFirst(
        strArr[1]
    )}`;
}

function getHorarioArray(horarioStr) {
    let horarioArr = horarioStr.split("-");
    horarioArr = horarioArr.map((hr) => {
        return hr.replace(" ", "");
    });
    return horarioArr;
}

function getHorarioByDayNumber(lashista, todayNumber) {
    try {
        let horarioJSON =
            todayNumber > 4
                ? getHorarioArray(lashista.horarioSBD)
                : JSON.parse(lashista.horarioLV).map((hr) =>
                      getHorarioArray(hr)
                  );

        horarioJSON =
            todayNumber > 4
                ? horarioJSON
                : horarioJSON.length > 1
                ? [horarioJSON[0][0], horarioJSON[1][1]]
                : horarioJSON[0];

        return horarioJSON;
    } catch (error) {
        console.log(error);
    }
}

function getMinutes(startTime, endTime) {
    // Parse hours and minutes
    const [startHour, startMinute] = startTime
        .split(":")
        .map(Number);
    const [endHour, endMinute] = endTime
        .split(":")
        .map(Number);

    // Convert to minutes since midnight
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    // Calculate difference
    const diffMinutes = endTotalMinutes - startTotalMinutes;

    return diffMinutes;
}

function getDayIndexNumber(date) {
    const timeZone = "America/Mexico_City";
    const zonedDate = toZonedTime(new Date(date), timeZone);
    return getDay(zonedDate);
}

function formatEventos(
    eventsArr,
    lashistasArr,
    selectedDate
) {
    const lashistas = getIndexedCollection(lashistasArr);
    const todayNumber = getDayIndexNumber(selectedDate);
    // const hora_start = horario.length > 1 ? horario[1][0]
    // const fecha_init =

    let eventosCambioHorario = eventsArr.filter((ev) => {
        return ev.tipo == "cambio-horario";
    });
    let formattedCambioHorario = [];

    if (eventosCambioHorario.length > 0) {
        eventosCambioHorario.forEach((ev) => {
            const horarios = decodeJSONToHorarioObjects(
                ev.horarios
            );
            horarios.forEach((horario) => {
                formattedCambioHorario.push({
                    ...ev,
                    hora_init: horario.inicio,
                    hora_fin: horario.final,
                });
            });
        });
    }
    // console.log(
    //     "eventos con cambio de horario",
    //     formattedCambioHorario
    // );

    let eventos = eventsArr.filter((ev) => {
        return ev.tipo != "cambio-horario";
    });
    eventos = [...eventos, ...formattedCambioHorario];
    eventos = eventos.map((ev) => {
        const allow = ["horas-libres", "cambio-horario"];
        let horario = getHorarioByDayNumber(
            lashistas[ev.id_lashista],
            todayNumber
        );

        return {
            title: `${ev.titulo}`,
            horario,
            start: `${ev.fecha_init}T${
                allow.includes(ev.tipo)
                    ? ev.hora_init
                    : horario[0]
            }:00`,
            end: `${ev.fecha_init}T${
                allow.includes(ev.tipo)
                    ? ev.hora_fin
                    : horario[1]
            }:00`,
            // end: ev.tipo == "horas-libres" ? ev.hora_fin : horario[1],
            // end: `${ev.fecha_init}T${ev.hora_fin}:00`,
            resourceId: `cama-${lashistas[
                ev.id_lashista
            ].nombre.toLowerCase()}-1`,
            extendedProps: {
                ...ev,
                status: 3,
            },
        };
    });

    // const fecha_init =
    //     ev.tipo == "horas-libres"
    //         ? `${ev.fecha_init}T${ev.hora_init}:00`
    //         : "";

    return eventos;
}

function getIndexedCollection(arr) {
    let indexedCollection = {};
    arr.forEach((object) => {
        indexedCollection[object.id] = object;
    });
    return indexedCollection;
}

function decodeHorario(horarios) {
    return horarios
        .split("-")
        .map((hora) => hora.replace(" ", ""));
}

function getHorarioObject(horarios) {
    const horariosArr = decodeHorario(horarios);
    return {
        inicio: horariosArr[0],
        final: horariosArr[1],
    };
}

function encodeHorarios(horarios) {
    return horarios.map((horario) => {
        return `${horario[0]} - ${horario[1]}`;
    });
}

function decodeJSONToHorarioObjects(horarios) {
    const arrayOfObjects = JSON.parse(horarios);
    return arrayOfObjects.map((horario) =>
        getHorarioObject(horario)
    );
}

function addMinutesToTime(timeStr, minutes) {
    // Parse the time string (HH:mm format)

    const [hours, mins] = timeStr.split(":").map(Number);

    // Create a date object for today with the given time
    const date = new Date();
    date.setHours(hours, mins, 0, 0);

    // Add minutes using date-fns
    const newDate = addMinutes(date, minutes);
    // console.log(timeStr, minutes, newDate);

    // Format back to HH:mm
    return format(newDate, "HH:mm");
}

function formatSpanishDate(dateStr) {
    const [day, month, year] = dateStr.split("-");
    const parsedDate = parse(
        `${year}-${month}-${day}`,
        "yyyy-MM-dd",
        new Date()
    );
    const zonedDate = toZonedTime(
        parsedDate,
        "America/Mexico_City"
    );
    return format(zonedDate, "EEEE d 'de' MMMM", {
        locale: es,
    })
        .split(" ")
        .map(
            (word) =>
                word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ");
}

function formatTimeToAMPM(timeStr) {
    const today = new Date().toISOString().split("T")[0]; // Use current date as base
    const parsedTime = parse(
        `${today} ${timeStr}`,
        "yyyy-MM-dd HH:mm",
        new Date()
    );
    const zonedTime = toZonedTime(
        parsedTime,
        "America/Mexico_City"
    );
    return format(zonedTime, "h:mm a").toLowerCase();
}

function mapLiveFeed(liveFeed) {
    const mapped = {
        camas: [],
        sillas: [],
    };
    liveFeed.forEach((item) => {
        const obj = {
            id: item.id,
            active: item.status == 1,
        }
        if (item.tipo == "cama") {
            mapped.camas.push(obj);
        } else if (item.tipo == "silla") {
            mapped.sillas.push(obj);
        }
    });
    return mapped;
}

export {
    decodeHorario,
    encodeHorarios,
    getMinutes,
    getDayIndexNumber,
    getHorarioByDayNumber,
    getIndexedCollection,
    formatEventos,
    formatEventType,
    getFechaLocal,
    formatHorario,
    capitalizeFirst,
    getDateObject,
    formatCamaID,
    formatHoyTitle,
    formatFechaYMD,
    formatFechaDMY,
    queryPlusFilters,
    parseQueryFilters,
    getHorarioObject,
    decodeJSONToHorarioObjects,
    addMinutesToTime,
    formatSpanishDate,
    formatTimeToAMPM,
    mapLiveFeed,
};
