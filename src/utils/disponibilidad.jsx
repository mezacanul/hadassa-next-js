function generarHorarioDelDia({ weekend = false }) {
    const startHour = weekend ? 9 : 9.5;
    const endHour = weekend ? 14.5 : 17.5; // 14:30 or 17:30
    const workDayHours = [];

    for (let time = startHour; time <= endHour; time += 0.5) {
        const hour = Math.floor(time);
        const minute = time % 1 === 0 ? "00" : "30";
        workDayHours.push(`${hour.toString().padStart(2, "0")}:${minute}`);
    }

    return workDayHours;
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
    servicios,
    horarioDelDia
) {
    // console.log(horarioDelDia);

    const indexHoraCita = horarioDelDia.indexOf(cita.hora);
    // const indexHoraCita = horariosDeCama.indexOf(cita.hora);
    const intervalosOcupados = detallesServicio.minutos / 30;
    const horariosOcupados = horarioDelDia.slice(
        // const horariosOcupados = horariosDeCama.slice(
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
 * Checks if slots is a consecutive subarray of horariosCama.
 * @param {string[]} horariosCama - Main array (e.g., bed slots).
 * @param {string[]} slots - Subarray to find (e.g., cita slots).
 * @param {string[]} servicio.directiva - Reglas del servicio.
 * @returns {boolean} - True if slots are a consecutive part of horariosCama.
 */
function puedeAgendar(horariosCama, slots, directiva) {
    if (!slots) {
        return false;
    }
    let pass = null;

    if (directiva[0] == 1) {
        slots.forEach((slt) => {
            if (pass != false) {
                if (horariosCama.includes(slt)) {
                    pass = true;
                } else {
                    pass = false;
                }
            }
        });
    }

    if (directiva[0] == -1) {
        const lastIdx = slots.length - 1;

        slots.forEach((slt, idx) => {
            if (pass != false) {
                if (idx == lastIdx) {
                    // if(slots[0] == "09:30"){ console.log({slt, pass, lastIdx}) }
                    if (
                        horariosCama.includes(slt) ||
                        horariosCama.includes(`+${slt}`)
                    ) {
                        pass = true;
                        // if(slots[0] == "09:30"){ console.log(slt, pass) }
                    } else if (
                        !horariosCama.includes(slt) ||
                        !horariosCama.includes(`+${slt}`)
                    ) {
                        pass = false;
                        // if(slots[0] == "09:30"){ console.log(slt, pass) }
                    }
                } else if (horariosCama.includes(slt)) {
                    pass = true;
                    // if(slots[0] == "09:30"){ console.log(slt, pass) }
                } else {
                    pass = false;
                }
            }
        });
    }

    if (directiva[0] == 0 && directiva[1] == -1) {
        // if(slots[0] == "09:30"){ console.log("testing") }
        let present = {
            first:
                horariosCama.includes(slots[0]) ||
                horariosCama.includes(`-${slots[0]}`),
            second:
                horariosCama.includes(slots[1]) ||
                horariosCama.includes(`+${slots[1]}`),
        };
        if (present.first == true && present.second == true) {
            pass = true;
        } else {
            pass = false;
        }
    }

    // if (slots[0] == "09:30") {
    //     console.log(slots, pass);
    // }
    return pass;
}

function sortByHora(array) {
    return array.sort((a, b) => {
        const getTimeValue = (hora) => {
            const [h, m] = hora.replace(/[+-]/, "").split(":").map(Number);
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
    servicios,
    horarioDelDia
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
                    servicios,
                    horarioDelDia
                )
            );
        } else {
            citasPorCama[currentID] = [];
        }

        // console.log(citasPorCama);

        // 3.- Lopeamos cada CITA para:
        // - Eliminar todos los horarios ocupados en 1ra cama
        // - Aplicar las reglas correspondientes en 2a cama
        citasPorCama[currentID].forEach((cita) => {
            // console.log(horariosDispPorCama[currentID]);

            // Eliminamos todos los horarios ocupados
            // en 1ra cama por default
            // en 2a cama si unica directiva es [1]
            cita.horariosOcupados1aCama.forEach((horarioOcupado1aCama, idx) => {
                horariosDispPorCama[currentID] = horariosDispPorCama[
                    currentID
                ].filter(
                    (horario1aCama) => {
                        // console.log(currentID, horarioOcupado1aCama, horario1aCama);
                        // return horarioOcupado1aCama != horario1aCama
                        let hora = horario1aCama.replace("+", "");
                        // if(cita.reglasDeServicio[0] != 0){
                        //     hora = hora.replace("-", "")
                        // }
                        return horarioOcupado1aCama != hora;
                    }
                    // (horario1aCama) => horario1aCama.includes(`-${horarioOcupado1aCama}`) || horario1aCama.includes(`+${horarioOcupado1aCama}`)
                );

                // Eliminamos horario ocupado en segunda cama
                // si unica regla es [1]
                if (cita.reglasDeServicio[0] == 1) {
                    horariosDispPorCama[siblingID] = horariosDispPorCama[
                        siblingID
                    ].filter(
                        // (horario2aCama) => horario2aCama.includes(`-${horarioOcupado1aCama}`) || horario2aCama.includes(`+${horarioOcupado1aCama}`)
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

function getAvailable(horariosDispPorCama, citaData, horarioDelDia, servicios, dev = false) {
    try {
        const camasKeys = Object.keys(horariosDispPorCama);
        const dirServicio = JSON.parse(servicios[citaData.servicio_id].regla)
        let registry = [];
        let available = {}
        if (dev) {
            available.dir = dirServicio
            available.registry = []
            available.camas = {}
            camasKeys.forEach((key) => {
                available.camas[key] = []
            })
        } else {
            available = []
        }

        // Loopeamos cada cama 
        camasKeys.forEach((camaID) => {
            const horariosCama = horariosDispPorCama[camaID];
            // console.log(camaID, horariosCama);

            // Loopeamos cada hora disponible 
            horariosCama.forEach((hora) => {
                // console.log(hora);
                const horaClean = hora.replace("+", "").replace("-", "");
                const slots = getSlots(
                    { hora: horaClean, servicio_id: citaData.servicio_id },
                    horarioDelDia,
                    servicios
                );

                if (puedeAgendar(horariosCama, slots, dirServicio)) {
                    // available.push(hora);
                    if (!registry.includes(hora) && !dev) {
                        // console.log({ cama: camaID, hora });
                        available.push({ cama: camaID, hora });
                        registry.push(hora);
                    } else if (dev) {
                        available.camas[camaID].push(hora)
                        available.registry.push(hora);
                    }
                }
            });
        });

        // available = [...new Set(available)];
        // available = sortHours(available);
        if (dev) {
            available.registry = [...new Set(available.registry)];
            return available
        } else {
            available = sortByHora(available);
            return available;
        }
    } catch (error) {
        console.log("error", error);
        return "error in getAvailable"
    }
}

function refineHorarios(available, camasKeys){
    let availableArr = [];

    available.registry.forEach((hr) => {
        if (available.dir[0] == 0 && available.dir[1] == -1) {
            if (
                !availableArr.includes(hr) &&
                available.camas[camasKeys[1]].includes(hr)
            ) {
                availableArr.push({hora: hr, cama: camasKeys[1]});
            } else if (
                !availableArr.includes(hr) &&
                available.camas[camasKeys[0]].includes(hr)
            ) {
                availableArr.push({hora: hr, cama: camasKeys[0]});
            }
        } else {
            if (
                !availableArr.includes(hr) &&
                available.camas[camasKeys[0]].includes(hr)
            ) {
                availableArr.push({hora: hr, cama: camasKeys[0]});
            } else if (
                !availableArr.includes(hr) &&
                available.camas[camasKeys[1]].includes(hr)
            ) {
                availableArr.push({hora: hr, cama: camasKeys[1]});
            }
        }
    });

    return availableArr
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
    getFamTree,
    getHorariosOcupadosPorServicio,
    getSlots,
    puedeAgendar,
    GenerarHorariosDisponibles,
    sortHours,
    getAvailable,
    refineHorarios,
    sortByHora
};
