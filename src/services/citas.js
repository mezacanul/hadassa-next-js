import axios from "axios";

function cancelCita(id) {
    return axios
        .patch(`/api/citas/${id}`, {
            column: "status",
            value: 0,
        })
        .then((resp) => resp);
}

function confirmarCita(id) {
    return axios
        .patch(`/api/citas/${id}`, {
            column: "status",
            value: 2,
        })
        .then((resp) => resp);
}

function pagarCita(id, metodoPago, precio) {
    return axios
        .patch(`/api/citas/${id}`, {
            column: "pagado",
            value: 1,
            metodoPago,
            precio,
        })
        .then((resp) => resp);
}

function actualizarEnServicio(id, enServicio) {
    return axios
        .patch(`/api/citas/${id}`, {
            column: "en_servicio",
            value: enServicio,
        })
        .then((resp) => resp);
}

const citasService = {
    cancelCita,
    confirmarCita,
    pagarCita,
    actualizarEnServicio,
};

export default citasService;
