import disponibilidadService from "../services/disponibilidad";

async function getHorariosDisponibles(body) {
    console.log("Controller", body);
    const { fecha, servicio_id, lashista_id, dev } = body;
    const parametros = {
        fecha,
        servicio_id,
        lashista_id,
        dev,
        // clienta_id: req.body.clienta_id ? req.body.clienta_id : null,
    };
    return await disponibilidadService.getHorariosDisponibles(
        parametros
    );
}

export default {
    getHorariosDisponibles,
};
