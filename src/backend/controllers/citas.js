import citasService from "../services/citas";

async function getByID(req) {
    const { id } = req.query;
    return await citasService.getByID(id);
}

async function getByClientaID(req) {
    const { clienta } = req.query;
    return await citasService.getByClientaID(clienta);
}

async function getByMultipleFilters(req) {
    // console.log("controller", req.query);
    return await citasService.getByMultipleFilters(
        req.query
    );
}

async function createCita(req) {
    const cita = req.body;
    // console.log("CREATE CITA");
    // console.log(req.body);
    const mysql_response = await citasService.createCita(
        cita
    );
    const { uuid, affectedRows } = mysql_response;
    if (affectedRows > 0) {
        return {
            uuid,
            inserted: affectedRows,
        };
    } else {
        return {
            error: "API Service Error on createCita",
        };
    }
}

export default {
    getByID,
    getByClientaID,
    getByMultipleFilters,
    createCita,
};
