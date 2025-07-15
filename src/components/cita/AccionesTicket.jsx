import {
    Button,
    Grid,
    Heading,
    HStack,
    Spinner,
    VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useMetodoPago } from "../agendar-cita/OrderSummary";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import { parse, format } from "date-fns";
import { es } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";

const buttonStyles = {
    fontWeight: 700,
    shadow: "sm",
    variant: "subtle",
};

function formatSpanishDate(dateStr) {
    const [day, month, year] = dateStr.split("-");
    const parsedDate = parse(
        `${year}-${month}-${day}`,
        "yyyy-MM-dd",
        new Date()
    );
    const zonedDate = toZonedTime(
        parsedDate,
        "America/Mexico_City"
    );
    return format(zonedDate, "EEEE d 'de' MMMM", {
        locale: es,
    })
        .split(" ")
        .map(
            (word) =>
                word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ");
}

function formatTimeToAMPM(timeStr) {
    const today = new Date().toISOString().split("T")[0]; // Use current date as base
    const parsedTime = parse(
        `${today} ${timeStr}`,
        "yyyy-MM-dd HH:mm",
        new Date()
    );
    const zonedTime = toZonedTime(
        parsedTime,
        "America/Mexico_City"
    );
    return format(zonedTime, "h:mm a").toLowerCase();
}

function copyMessage(cita, tipo) {
    let message = "";
    if (tipo == "confirmacion") {
        message = `Confirmo tu cita del día *${formatSpanishDate(
            cita.fecha
        )} a la${
            cita.hora.includes("13") ? "" : "s"
        } ${formatTimeToAMPM(cita.hora)}* para servicio de *${
            cita.servicio
        }* ✨
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
    // return message
}

function createWhatsAppUrl(cita) {
    const instructions =
        "Presiona Ctrl + A y después Ctrl + V";

    const phone = `${cita.lada}${cita.telefono}`;
    // const encodedMessage = encodeURIComponent(message);
    const encodedInstructions =
        encodeURIComponent(instructions);
    // const msg = copyMessage(cita, "recordatorio")
    // return `https://wa.me/${phone}?text=${msg}`;
    return `https://wa.me/${phone}?text=${encodedInstructions}`;
    // return `https://wa.me/${phone}?text=${encodedMessage}`;
}

export default function AccionesTicket({ cita, setCita }) {
    // const [cita, setCita] = useCita();
    const [loadingUpdate, setLoadingUpdate] =
        useState(false);
    const [mp, setMp] = useMetodoPago();

    useEffect(() => {
        console.log(cita);
    }, []);

    function confirmarCita() {
        setLoadingUpdate(true);
        axios
            .patch(`/api/citas/${cita.cita_ID}`, {
                column: "status",
                value: 2,
            })
            .then((updateResp) => {
                console.log(updateResp);
                const resp = updateResp.data;
                if (
                    resp.success &&
                    resp.affectedRows == 1
                ) {
                    setCita({ ...cita, status: 2 });
                } else {
                    alert("Error");
                }
                setLoadingUpdate(false);
            });
    }

    function cancelarCita() {
        setLoadingUpdate(true);
        axios
            .patch(`/api/citas/${cita.cita_ID}`, {
                column: "status",
                value: 0,
            })
            .then((updateResp) => {
                console.log(updateResp);
                const resp = updateResp.data;
                if (
                    resp.success &&
                    resp.affectedRows == 1
                ) {
                    setCita({ ...cita, status: 0 });
                } else {
                    alert("Error");
                }
                setLoadingUpdate(false);
            });
    }

    function marcarComoPagada() {
        setLoadingUpdate(true);
        const send = {
            // citaID: cita.cita_ID,
            column: "pagado",
            value: 1,
            metodoPago: mp[0],
            precio:
                mp[0] == "efectivo"
                    ? cita.precio
                    : cita.precio_tarjeta,
        };
        console.log(send);
        // return
        axios
            // .patch(`/api/citas/${cita.cita_ID}`, { column: "pagado", value: 1 })
            .patch(`/api/citas/${cita.cita_ID}`, send)
            .then((updateResp) => {
                console.log(updateResp);
                const resp = updateResp.data;
                if (
                    resp.success &&
                    resp.affectedRows == 1
                ) {
                    setCita({
                        ...cita,
                        pagado: 1,
                        fecha_pagado: format(
                            new Date(),
                            "yyyy-MM-dd HH:mm:ss"
                        ),
                        monto_pagado:
                            mp[0] == "efectivo"
                                ? cita.precio
                                : cita.precio_tarjeta,
                        metodo_pago: mp[0],
                    });
                    console.log();
                } else {
                    alert("Error");
                }
                setLoadingUpdate(false);
            });
    }

    return (
        <VStack
            w={"100%"}
            gap={"1rem"}
            align={"center"}
        >
            {loadingUpdate && (
                <Spinner
                    borderWidth={"3px"}
                    size={"xl"}
                    color={"pink.500"}
                />
            )}

            {cita.status != 0 && (
                <HStack w={"100%"}>
                    <Link
                        style={{ width: "100%" }}
                        href={createWhatsAppUrl(cita)}
                        target="_blank"
                    >
                        <Button
                            onClick={() => {
                                copyMessage(
                                    cita,
                                    "confirmacion"
                                );
                            }}
                            // onClick={marcarComoPagada}
                            {...buttonStyles}
                            colorPalette={"green"}
                            w={"100%"}
                        >
                            {"Confirmación"}
                            <FaWhatsapp />
                        </Button>
                    </Link>

                    <Link
                        style={{ width: "100%" }}
                        href={createWhatsAppUrl(cita)}
                        target="_blank"
                    >
                        <Button
                            onClick={() => {
                                copyMessage(
                                    cita,
                                    "recordatorio"
                                );
                            }}
                            {...buttonStyles}
                            colorPalette={"green"}
                            w={"100%"}
                        >
                            {"Recordatorio"}
                            <FaWhatsapp />
                        </Button>
                    </Link>
                </HStack>
            )}

            {!loadingUpdate && (
                <>
                    <Grid
                        gap={"1rem"}
                        gridTemplateColumns={"1fr 1fr"}
                        w={"100%"}
                    >
                        {cita.status != 0 && (
                            <Button
                                onClick={cancelarCita}
                                {...buttonStyles}
                                colorPalette={"orange"}
                            >
                                Cancelar Cita
                            </Button>
                        )}
                        {cita.status != 2 &&
                            cita.status != 0 && (
                                <Button
                                    onClick={confirmarCita}
                                    {...buttonStyles}
                                    colorPalette={"blue"}
                                >
                                    Confirmar Cita
                                </Button>
                            )}
                    </Grid>

                    {cita.pagado != 1 &&
                        cita.status != 0 && (
                            <Button
                                onClick={marcarComoPagada}
                                {...buttonStyles}
                                colorPalette={"green"}
                                w={"100%"}
                            >
                                Marcar como Pagada
                            </Button>
                        )}
                </>
            )}
        </VStack>
    );
}
