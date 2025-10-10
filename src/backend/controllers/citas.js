import citasService from "../services/citas";

async function getByID(req, res) {
    const row = await citasService.getByID(req.query.id);
    res.status(200).json(row);
}

async function getByClientaID(req, res) {
    const rows = await citasService.getByClientaID(
        req.query.clienta
    );
    res.status(200).json(rows);
}

async function getByMultipleFilters(req, res) {
    const rows = await citasService.getByMultipleFilters(
        req.query
    );
    res.status(200).json(rows);
}

export default {
    getByID,
    getByClientaID,
    getByMultipleFilters,
};
