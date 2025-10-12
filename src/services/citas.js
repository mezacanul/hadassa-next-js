import axios from "axios";

function cancelCita(id) {
    return axios
        .patch(`/api/citas/${id}`, {
            column: "status",
            value: 0,
        })
        .then((resp) => resp);
}

const citasService = {
    cancelCita,
};

export default citasService;
