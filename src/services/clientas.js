import axios from "axios";

function getClientas() {
    return axios.get("/api/clientas");
}

function deleteClienta(id) {
    return axios
        .delete(`/api/clientas/${id}`)
        .then((resp) => resp);
}

const clientasService = {
    getClientas,
    deleteClienta,
};

export default clientasService;
