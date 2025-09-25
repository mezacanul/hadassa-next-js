import axios from "axios";

function getClientas() {
    return axios.get("/api/clientas");
}

const clientasService = {
    getClientas,
};

export default clientasService;
