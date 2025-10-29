import clientasService from "./clientas";
import citasService from "./citas";
import horariosService from "./horarios";
import liveService from "./live";

const API = {
    clientas: clientasService,
    citas: citasService,
    horarios: horariosService,
    live: liveService,
};

export default API;