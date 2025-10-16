import {
    generarHorarioDelDia,
    getDayName,
    getHorarioLashista,
} from "@/utils/disponibilidad-v1.2";
// import {
//     generarHorarioDelDia,
//     getDayName,
// } from "@/utils/disponibilidad";
import citasRepository from "../repositories/citas";
import serviciosRepository from "../repositories/servicios";
import lashistasRepository from "../repositories/lashistas";
import eventosRepository from "../repositories/eventos";
import utilsRepository from "../repositories/utils";
import camasRepository from "../repositories/camas";

async function getHorariosDisponibles(parametros) {
    // Nombre del dia
    const dayName = getDayName(parametros.fecha);
    // Horarios del studio
    const horariosStudio =
        await utilsRepository.getStudioHorarios();

    // Horarios de la fecha correspondiente
    const horarioDelDia = generarHorarioDelDia({
        dayName,
        horariosStudio,
    });

    // Lashista y horarios de la lashista correspondiente al dia
    const [lashista] = await lashistasRepository.getById(
        parametros.lashista_id
    );
    const horarioLashista = getHorarioLashista(
        lashista,
        dayName
    );

    const citasDelDia =
        await citasRepository.getCitasDelDiaByLashista(
            parametros.fecha,
            parametros.lashista_id
        );
    // const servicios = await serviciosRepository.getAll();
    // const camasIDs =
    // await camasRepository.getCamasIDsByLashista(
    //         parametros.lashista_id
    //     );
    // const eventos =
    //     await eventosRepository.getByFechaAndLashista(
    //         parametros.fecha,
    //         parametros.lashista_id
    //     );

    return citasDelDia;
}

export default {
    getHorariosDisponibles,
};
