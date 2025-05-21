function generarHorarioDelDia({ weekend = false }) {
    const startHour = 9.5;
    const endHour = weekend ? 14.5 : 17.5; // 14:30 or 17:30
    const workDayHours = [];

    for (let time = startHour; time <= endHour; time += 0.5) {
        const hour = Math.floor(time);
        const minute = time % 1 === 0 ? "00" : "30";
        workDayHours.push(`${hour.toString().padStart(2, "0")}:${minute}`);
    }

    return workDayHours;
}

function getCamaAgendar(disponibilidad) {
    const camasKeys = Object.keys(disponibilidad);

    const todasDisponibles = camasKeys.every((camaID) => {
        return disponibilidad[camaID] == true;
    });

    const noDisponible = camasKeys.every((camaID) => {
        return disponibilidad[camaID] == false;
    });

    if (todasDisponibles == true) {
        console.log("available");
        return camasKeys[0];
    } else if (noDisponible == true) {
        console.log("not available");
        return null;
    } else {
        let response = "";
        camasKeys.forEach((camaID) => {
            if (disponibilidad[camaID] == true) {
                response = camaID;
            }
        });
        return response;
    }
}

/**
 * Returns a family tree object for a given bed, including current bed details and siblings.
 * @param {string[]} camasKeys - Array of bed identifiers.
 * @param {string} camaID - The ID of the current bed.
 * @param {number} loopIDX - The index of the current bed in camasKeys.
 * @returns {FamTree} - Object with current bed ID, its index, sibling bed IDs, and their indices.
 * @throws {Error} - If camaID or loopIDX is invalid.
 */
function getFamTree(camasKeys, camaID, loopIDX) {
    if (loopIDX < 0 || loopIDX >= camasKeys.length) {
        throw new Error(`Invalid loopIDX: ${loopIDX}`);
    }
    if (camasKeys[loopIDX] !== camaID) {
        throw new Error(
            `camaID "${camaID}" does not match camasKeys[${loopIDX}]`
        );
    }

    const siblings = camasKeys.filter((cama) => cama !== camaID);
    const siblingsIDX = camasKeys
        .map((cama, idx) => (cama !== camaID ? idx : -1))
        .filter((idx) => idx !== -1);

    return {
        current: camaID,
        currentIDX: loopIDX,
        siblings,
        siblingsIDX,
    };
}

/**
 * Retorna los horarios ocupados en cadad cama
 * @param {Object} horariosDeCama - Arreglo con todas las horas (sin filtrar) del dia
 * @param {string} horaCita - El horario de la cita que se quiere agendar
 * @param {Object} detallesServicio - Detalles del servicio
 * @returns {Array} - Arreglo con horarios ocupados
 */
function getHorariosOcupadosPorServicio(
    horariosDeCama,
    detallesServicio,
    cita,
    servicios
) {
    const indexHoraCita = horariosDeCama.indexOf(cita.hora);
    const intervalosOcupados = detallesServicio.minutos / 30;
    const horariosOcupados = horariosDeCama.slice(
        indexHoraCita,
        indexHoraCita + intervalosOcupados
    );
    const reglasDeAgenda = JSON.parse(servicios[cita.servicio_id].regla);
    let horariosMantener = [];

    if (reglasDeAgenda.includes(0)) {
        horariosMantener.push(horariosOcupados[0]);
    }
    if (reglasDeAgenda.includes(-1)) {
        horariosMantener.push(horariosOcupados[horariosOcupados.length - 1]);
    }
    // if (reglasDeAgenda.includes(1)) {
    // }

    const response = {
        servicioID: cita.servicio_id,
        servicio: cita.servicio,
        horariosOcupados1aCama: horariosOcupados,
        horariosMantener2aCama: horariosMantener,
        /**
         * @type {ReglasDeServicio}
         */
        reglasDeServicio: reglasDeAgenda,
    };
    // console.log(response);
    return response;
}

function getSlots(cita, horarioDelDia, servicios) {
    const slotsCount = servicios[cita.servicio_id].minutos / 30;

    let count = { start: horarioDelDia.indexOf(cita.hora) };
    const citaSlots = horarioDelDia.slice(
        count.start,
        count.start + slotsCount
    );
    return citaSlots;
}

/**
 * Checks if subArray is a consecutive subarray of array.
 * @param {string[]} array - Main array (e.g., bed slots).
 * @param {string[]} subArray - Subarray to find (e.g., cita slots).
 * @param {string[]} servicio.directiva - Reglas del servicio.
 * @returns {boolean} - True if subArray is a consecutive part of array.
 */
function isSubArray(array, subArray, directivaJSON) {
    const directiva = JSON.parse(directivaJSON);

    return array.some((_, i) =>
        array.slice(i, i + subArray.length).every((horario, horarioIdx) => {
            // console.log(horario, horarioIdx);
            // return horario === subArray[horarioIdx];

            if (directiva[0] == 0) {
                if (horarioIdx == 0) {
                    horario = horario.replace("-", "");
                } else if (horarioIdx == 1) {
                    horario = horario.replace("+", "");
                }
                return horario === subArray[horarioIdx];
            } else {
                return horario === subArray[horarioIdx];
            }
        })
    );
}

function GenerarHorariosDisponibles(){
    return
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
    getCamaAgendar,
    getFamTree,
    getHorariosOcupadosPorServicio,
    getSlots,
    isSubArray,
};
