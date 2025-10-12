import {
    parse,
    format,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    getYear,
} from "date-fns";
import { enUS, es } from "date-fns/locale";
import { capitalizeFirst, getHorarioObject } from "./main";

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

function horarioJSONToFullArray(horarioJSON) {
    let nuevoHorario = JSON.parse(horarioJSON);
    nuevoHorario = nuevoHorario
        .map((hora) => {
            return getHorarioObject(hora);
        })
        .map((hora) => {
            return {
                inicio: encodeHoraToFloat(hora.inicio),
                final: encodeHoraToFloat(hora.final),
            };
        })
        .map((hora) => {
            return horarioObjectToFullArray(hora);
        });

    if (nuevoHorario.length == 1) {
        nuevoHorario = [...nuevoHorario[0]];
    } else if (nuevoHorario.length == 2) {
        nuevoHorario = [
            ...nuevoHorario[0],
            ...nuevoHorario[1],
        ];
    }
    return nuevoHorario;
}

function getSemana(date) {
    // Get start and end of the week (Monday to Sunday)
    date = parse(date, "dd-MM-yyyy", new Date());
    console.log(date);
    const weekStart = startOfWeek(date, {
        weekStartsOn: 1,
    }); // 1 = Monday
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 });

    // Get all days in the week
    const days = eachDayOfInterval({
        start: weekStart,
        end: weekEnd,
    });
    // console.log(days);

    // Transform to your desired shape
    const semana = days.map((day) => ({
        fecha: format(day, "dd-MM-yyyy"), // "11-10-2025"
        diaNum: format(day, "dd"), // "11"
        mesNombre: format(day, "MMMM", { locale: es }), // "octubre"
        titulo: capitalizeFirst(
            format(day, "EEEE dd 'de' MMM.", {
                locale: es,
            })
        ),
        anio: getYear(day), // 2025
    }));
    // console.log(semana);

    return {
        dias: semana.slice(0, 6),
        titulo: (
            <p style={{ fontSize: "1.2rem" }}>
                {`Semana del`}{" "}
                <b>{`${semana[0].diaNum} de ${semana[0].mesNombre}`}</b>{" "}
                {`al `}
                <b>{`${semana[5].diaNum} de ${semana[5].mesNombre}`}</b>
            </p>
        ),
    };
}

export {
    generarHorarioDelDia,
    getDayName,
    getHorarioLashista,
    horarioObjectToFullArray,
    encodeHoraToFloat,
    horarioJSONToFullArray,
    getSemana,
};
