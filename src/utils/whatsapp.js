import {
    formatSpanishDate,
    formatTimeToAMPM,
} from "./main";

function createWhatsAppUrl(cita) {
    const phone = `${cita.lada}${cita.telefono}`;
    const instructions =
        "Presiona Ctrl + A y después Ctrl + V";
    const encodedInstructions =
        encodeURIComponent(instructions);

    return `https://wa.me/${phone}?text=${encodedInstructions}`;
}

function copyMessage(cita, tipo) {
    let message = "";
    if (tipo == "confirmacion") {
        message = `Confirmo tu cita del día *${formatSpanishDate(
            cita.fecha
        )} a la${
            cita.hora.includes("13") ? "" : "s"
        } ${formatTimeToAMPM(
            cita.hora
        )}* para servicio de *${cita.servicio}* ✨
          \n🙋🏻‍♀️ La persona que te realizará el servicio es *${
              cita.lashista
          }*
          \n⏱️ Tu servicio tiene una duración de *${
              cita.minutos ? cita.minutos : "N/A"
          } minutos*
          \n⏰ Tienes una tolerancia de *5 minutos*, posterior a eso tu cita queda cancelada
          \n💵 *El costo del servicio es de $${
              cita.precio_tarjeta
          }*
          \nPagando en efectivo el costo es de $${
              cita.precio
          }`;
    }
    if (tipo == "recordatorio") {
        message = `Hola! Buen día 🌞
          \n*Mañana es tu cita a la${
              cita.hora.includes("13") ? "" : "s"
          } ${formatTimeToAMPM(cita.hora)}* ✨
          \nEs necesario asistir sin maquillaje ni productos en el área que se te realizará el servicio 🌸
          \n¿Podrás asistir? ☺️`;
    }
    navigator.clipboard.writeText(message);
}

const whatsappUtils = {
    createWhatsAppUrl,
    copyMessage,
};

export default whatsappUtils;