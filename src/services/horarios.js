import axios from "axios";

const horariosService = {
    getAll: () => {
        return axios.get("/api/horarios");
    },
};

export default horariosService;
