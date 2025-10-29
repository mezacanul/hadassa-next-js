import axios from "axios";

function getAll() {
    return axios.get("/api/live");
}

function update(body) {
    return axios.patch("/api/live", body);
}

const liveService = {
    getAll,
    update,
};

export default liveService;
