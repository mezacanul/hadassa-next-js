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
    if (citaSlots.length == slotsCount) {
        return citaSlots;
    } else {
        return null;
    }
}

/**
 * Checks if subArray is a consecutive subarray of array.
 * @param {string[]} array - Main array (e.g., bed slots).
 * @param {string[]} subArray - Subarray to find (e.g., cita slots).
 * @param {string[]} servicio.directiva - Reglas del servicio.
 * @returns {boolean} - True if subArray is a consecutive part of array.
 */
function puedeAgendar(array, subArray, directivaJSON) {
    if (!subArray) { return false }
    let pass = null;
    const directiva = JSON.parse(directivaJSON);

    if (directiva[0] == 1) {
        subArray.forEach((slt) => {
            if (array.includes(slt)) {
                pass = true;
            } else {
                return false
            }
        });
    }

    if (directiva[0] == -1) {
        const lastIdx = subArray.length - 1;
        subArray.forEach((slt, idx) => {
            if (idx == lastIdx) {
                if (array.includes(slt) || array.includes(`+${slt}`)) {
                    pass = true;
                }
            } else if (array.includes(slt)) {
                pass = true;
            } else {
                return false;
            }
        });
    }

    if (directiva[0] == 0 && directiva[1] == -1) {
        let present = {
            first: array.includes(subArray[0]) || array.includes(`-${subArray[0]}`),
            second: array.includes(subArray[1]) || array.includes(`+${subArray[1]}`),
        }
        if(present.first == true && present.second == true){
            pass = true
        } else {
            return false
        }
    }

    // console.log(directiva, subArray, array);
    return pass;
}

function sortByHora(array) {
    return array.sort((a, b) => {
        const getTimeValue = (hora) => {
            const [h, m] = hora.replace(/[+-]/, '').split(':').map(Number);
            return h * 60 + m;
        };
        // Sort by time value, keeping original hora order
        return getTimeValue(a.hora) - getTimeValue(b.hora);
    });
}

function GenerarHorariosDisponibles(
    camasKeys,
    citasPorCama,
    horariosDispPorCama,
    servicios
) {
    // 1.- Loopeamos por cada CAMA
    camasKeys.forEach((camaID, IDX) => {
        const famTree = getFamTree(camasKeys, camaID, IDX);
        const currentID = famTree.current;
        const siblingID = famTree.siblings[0];

        // 2.- Asignamos detalles de citas
        // por cama { ...camaID's: ... }
        if (citasPorCama[currentID]) {
            citasPorCama[currentID] = citasPorCama[currentID].map((cita) =>
                getHorariosOcupadosPorServicio(
                    horariosDispPorCama[currentID],
                    servicios[cita.servicio_id],
                    cita,
                    servicios
                )
            );
        } else {
            citasPorCama[currentID] = [];
        }

        // 3.- Lopeamos cada CITA para:
        // - Eliminar todos los horarios ocupados en 1ra cama
        // - Aplicar las reglas correspondientes en 2a cama
        citasPorCama[currentID].forEach((cita) => {
            // Eliminamos todos los horarios ocupados
            // en 1ra cama por default
            // en 2a cama si unica directiva es [1]
            cita.horariosOcupados1aCama.forEach((horarioOcupado1aCama, idx) => {
                horariosDispPorCama[currentID] = horariosDispPorCama[
                    currentID
                ].filter(
                    (horario1aCama) => horarioOcupado1aCama != horario1aCama
                );

                // Eliminamos horario ocupado en segunda cama
                // si unica regla es [1]
                if (cita.reglasDeServicio[0] == 1) {
                    horariosDispPorCama[siblingID] = horariosDispPorCama[
                        siblingID
                    ].filter(
                        (horario2aCama) => horarioOcupado1aCama != horario2aCama
                    );
                }
            });

            // Transformamos ultimo horario en 2a cama si reglas incluyen [-1]: "-00:00"
            if (cita.reglasDeServicio.includes(-1)) {
                const ultimoHorario1aCama =
                    cita.horariosOcupados1aCama[
                        cita.horariosOcupados1aCama.length - 1
                    ];
                const IDX_ultimoHorario1aCama =
                    horariosDispPorCama[siblingID].indexOf(ultimoHorario1aCama);
                horariosDispPorCama[siblingID][
                    IDX_ultimoHorario1aCama
                ] = `-${horariosDispPorCama[siblingID][IDX_ultimoHorario1aCama]}`;
            }

            // Transformamor primer horario en 2a cama si 1ra regla es [0]: "+00:00"
            if (cita.reglasDeServicio[0] == 0) {
                const primerHorario1raCama = cita.horariosOcupados1aCama[0];
                const IDX_primerHorario1raCama =
                    horariosDispPorCama[siblingID].indexOf(
                        primerHorario1raCama
                    );
                horariosDispPorCama[siblingID][
                    IDX_primerHorario1raCama
                ] = `+${horariosDispPorCama[siblingID][IDX_primerHorario1raCama]}`;
            }

            // Eliminamos el resto de horarios en 2a cama
            // que coinciden con los horarios de 1ra cama
            cita.horariosOcupados1aCama.forEach((horario) => {
                horariosDispPorCama[siblingID] = horariosDispPorCama[
                    siblingID
                ].filter((horarioSibling) => horario != horarioSibling);
            });
        });
    });
    return horariosDispPorCama;
}

function sortHours(hours) {
    return hours.sort((a, b) => {
        const getTimeValue = (time) => {
            const [h, m] = time.replace(/[+-]/, "").split(":").map(Number);
            return h * 60 + m;
        };
        return getTimeValue(a) - getTimeValue(b);
    });
}

function getAvailable(horariosDispPorCama, citaData, horarioDelDia, servicios) {
    const camasKeys = Object.keys(horariosDispPorCama)
    const dirServicio = servicios[citaData.servicio_id].regla;
    let registry = [];
    // let available = {};
    let available = [];

    camasKeys.forEach((camaID)=>{
        const horariosCama = horariosDispPorCama[camaID]

        horariosCama.forEach((hora) => {
            const horaClean = hora.replace("+", "").replace("-", "");
            const slots = getSlots(
                { hora: horaClean, servicio_id: citaData.servicio_id },
                horarioDelDia,
                servicios
            );

            if (puedeAgendar(horariosCama, slots, dirServicio)) {
                if(!registry.includes(hora)){
                    available.push({cama: camaID, hora})
                    registry.push(hora);
                }
                // available.push(hora);
            }
        });
    })

    // available = [...new Set(available)];
    // available = sortHours(available);
    available = sortByHora(available)
    return available;
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
    puedeAgendar,
    GenerarHorariosDisponibles,
    sortHours,
    getAvailable,
};
