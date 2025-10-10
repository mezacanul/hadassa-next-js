import citasRepository from "../repositories/citas";
import utilsRepository from "../repositories/utils";

async function getByID(id) {
    const [row] = await citasRepository.getByID(id);
    return row;
}

async function getByClientaID(clientaId) {
    const rows = await citasRepository.getByClientaID(
        clientaId
    );
    return rows;
}

async function getByMultipleFilters(reqQuery) {
    const rows = await citasRepository.getByMultipleFilters(
        reqQuery
    );
    return rows;
}

async function createCita(cita) {
    const [uuid] = await utilsRepository.generateUUID();
    const { id } = uuid;
    console.log(id, cita);

    const hora = cita.horario.hora
        .replace("-", "")
        .replace("+", "");

    const mysql_response = await citasRepository.createCita(
        cita,
        id,
        hora
    );
    return { ...mysql_response, uuid: id };
}

export default {
    getByID,
    getByClientaID,
    getByMultipleFilters,
    createCita,
};
