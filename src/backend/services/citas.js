import { formatFechaYMD } from "@/utils/main";
import citasRepository from "../repositories/citas";

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

export default {
    getByID,
    getByClientaID,
    getByMultipleFilters,
};
