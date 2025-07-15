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
import { format } from "date-fns";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

const buttonStyles = {
    fontWeight: 700,
    shadow: "sm",
    variant: "subtle",
};

function createWhatsAppUrl(cita) {
    const phone = `${cita.lada}${cita.telefono}`;
    const message = `Hola ${cita.clienta_nombres}!\nThis is a test message\nOrder ID: 100\nDate: ${cita.fecha}\nHora: ${cita.hora}`;
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phone}?text=${encodedMessage}`;
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

            <Link
                style={{ width: "100%" }}
                href={createWhatsAppUrl(cita)}
                target="_blank"
            >
                <Button
                    // onClick={marcarComoPagada}
                    {...buttonStyles}
                    colorPalette={"green"}
                    w={"100%"}
                >
                    {"Enviar Recordatorio "}
                    <FaWhatsapp />
                </Button>
            </Link>

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
