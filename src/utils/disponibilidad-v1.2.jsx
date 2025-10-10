import { parse, format } from "date-fns";
import { enUS } from "date-fns/locale";
import { getHorarioObject } from "./main";

function isWeekend(dayName) {
    return ["Saturday", "Sunday"].includes(dayName);
}

function getDayName(fecha) {
    const parsedDate = parse(
        fecha,
        "dd-MM-yyyy",
        new Date()
    );
    return format(parsedDate, "eeee", { locale: enUS });
}

function encodeHoraToFloat(hora) {
    const [horas, minutos] = hora.split(":");
    const minutosFloat = minutos / 60;
    const horaFloat = Number(horas) + Number(minutosFloat);
    return horaFloat;
}

const getHorariosStudioObj = (horariosStudio) => {
    return horariosStudio.reduce((acc, horario) => {
        acc[horario.clave] = {
            ...horario,
            inicio: encodeHoraToFloat(horario.inicio),
            final: encodeHoraToFloat(horario.final),
        };
        return acc;
    }, {});
};

function horaFloatToString(time) {
    const hour = Math.floor(time);
    const minutes = time % 1 === 0 ? "00" : "30";
    return `${hour > 9 ? hour : `0${hour}`}:${minutes}`;
}

function generarHorarioDelDia({ dayName, horariosStudio }) {
    const isWeekendDay = isWeekend(dayName);
    const horariosObj =
        getHorariosStudioObj(horariosStudio);

    const startHour = isWeekendDay
        ? horariosObj.SBD.inicio
        : horariosObj.LV.inicio;
    const endHour = isWeekendDay
        ? horariosObj.SBD.final
        : horariosObj.LV.final;

    const workDayHours = [];
    for (
        let time = startHour;
        time < endHour;
        time += 0.5
    ) {
        // console.log(time);
        workDayHours.push(horaFloatToString(time));
    }

    return workDayHours;
}

function horarioObjectToFullArray(horarioObj) {
    const workDayHours = [];
    for (
        let time = horarioObj.inicio;
        time < horarioObj.final;
        time += 0.5
    ) {
        workDayHours.push(horaFloatToString(time));
    }
    return workDayHours;
}

function getHorarioLashista(lashista, dayName) {
    const isWeekendDay = isWeekend(dayName);
    if (!isWeekendDay) {
        const horarios = JSON.parse(lashista.horarioLV);
        let horariosDetail = horarios.map((horario) =>
            getHorarioObject(horario)
        );
        horariosDetail = horariosDetail.map(
            (horariosObj) => ({
                inicio: encodeHoraToFloat(
                    horariosObj.inicio
                ),
                final: encodeHoraToFloat(horariosObj.final),
            })
        );
        // horariosDetail = [ { inicio: 9.5, final: 13 }, { inicio: 14.5, final: 17 }, ]
        horariosDetail = horariosDetail.map((horariosObj) =>
            horarioObjectToFullArray(horariosObj)
        );
        return horariosDetail;
    } else {
        let horarioDetail = getHorarioObject(
            lashista.horarioSBD
        );
        horarioDetail = {
            inicio: encodeHoraToFloat(horarioDetail.inicio),
            final: encodeHoraToFloat(horarioDetail.final),
        };
        horarioDetail =
            horarioObjectToFullArray(horarioDetail);
        return [horarioDetail];
    }
}

/**
 * @typedef {Object} Servicio
 * @property {string} servicioID - Unique service identifier.
 * @property {string} servicio - Service name.
 * @property {string[]} horariosOcupados1aCama - Occupied time slots for first bed.
 * @property {string[]} horariosMantener2aCama - Reserved time slots for second bed.
 * @property {number[]} reglasDeServicio - Service rule IDs.
 */

/**
 * @typedef {Object} FamTree
 * @property {string} current - The ID of the current bed.
 * @property {number} currentIDX - The index of the current bed in the loop.
 * @property {string[]} siblings - Array of other bed IDs in the array being looped.
 * @property {number[]} siblingsIDX - Array of indices of other beds in the looping function.
 * @description Object representing the family tree of a bed in a looping context.
 */

/**
 * @typedef {number[]} ReglasDeServicio
 * @variation {[-1,0,1]}
 * @description Reglas de agenda:
 *  - -1: Se mantiene el último intervalo de horario (slot de media hora) en la segunda cama con un signo de -.
 *  -  0: Se mantiene disponible el primer slot horario en la segunda cama.
 *  -  1: Se quitan todos los slots correspondientes a la cita en la segunda cama.
 * @description Duración de cada slot: 30 minutos.
 * @example Ejemplo de slots horarios: ["10:00", "10:30"].
 */

export {
    generarHorarioDelDia,
    getDayName,
    getHorarioLashista,
};
