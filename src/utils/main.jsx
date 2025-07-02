import { es } from "date-fns/locale"; // Spanish locale
import { format, parse, getDay } from "date-fns";
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
        "dd 'de' MMMM",
        { locale: es }
    );
    return formatted;
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
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
  
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

    const eventos = eventsArr.map((ev) => {
        let horario = getHorarioByDayNumber(
            lashistas[ev.id_lashista],
            todayNumber
        );
        
        return {
            title: `${ev.titulo}`,
            horario,
            start: `${ev.fecha_init}T${
                ev.tipo == "horas-libres"
                    ? ev.hora_init
                    : horario[0]
            }:00`,
            end: `${ev.fecha_init}T${
                ev.tipo == "horas-libres"
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

export {
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
};
