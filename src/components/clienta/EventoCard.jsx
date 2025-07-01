import {
    Badge,
    Button,
    Grid,
    Heading,
    HStack,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import { FaRegClock } from "react-icons/fa6";
import { FaRegCalendar } from "react-icons/fa6";
import { format } from "date-fns";
import {
    formatEventType,
    getFechaLocal,
} from "@/utils/main";
import { useState } from "react";
import axios from "axios";

export default function EventoCard({
    evento,
    setCurrentEvento,
    setCurrentView,
}) {
    const [status, setStatus] = useState("iddle");
    const formatted = {
        fecha_init: getFechaLocal(evento.fecha_init),
        fecha_fin: evento.fecha_fin
            ? getFechaLocal(evento.fecha_fin)
            : null,
        hora_init: evento.hora_init
            ? format(
                  new Date(
                      `2025-01-01 ${evento.hora_init}`
                  ),
                  "hh:mm a"
              )
            : null,
        hora_fin: evento.hora_fin
            ? format(
                  new Date(`2025-01-01 ${evento.hora_fin}`),
                  "hh:mm a"
              )
            : null,
    };

    function handleCancelar() {
        console.log(evento.id);
        // return
        setStatus("loading");
        axios
            .patch(`/api/eventos?id=${evento.id}`)
            .then((axiosResp) => {
                console.log(axiosResp);
                const resp = axiosResp.data;
                if (resp.success && resp.affectedRows > 0) {
                    setCurrentView("tabla");
                    setTimeout(() => {
                        setCurrentEvento(null);
                    }, 100);
                }
            });
    }

    return (
        <VStack
            bg={"white"}
            p={"1rem"}
            rounded={"md"}
            shadow={"md"}
            alignItems={"start"}
            w={"100%"}
            gap={"1.5rem"}
        >
            <HStack
                w={"100%"}
                alignItems={"start"}
                justifyContent={"space-between"}
            >
                <VStack alignItems={"start"}>
                    <Heading>{evento.titulo}</Heading>
                    {evento.status == 0 && (
                        <Badge
                            shadow={"sm"}
                            fontWeight={700}
                            colorPalette={"red"}
                        >
                            {"Cancelado"}
                        </Badge>
                    )}
                </VStack>

                <Badge
                    shadow={"sm"}
                    fontWeight={700}
                    colorPalette={"purple"}
                >
                    {formatEventType(evento.tipo)}
                </Badge>
            </HStack>

            <Grid
                gridTemplateColumns={"1fr 1fr"}
                gap={"1rem"}
                w={"100%"}
            >
                <VStack alignItems={"start"}>
                    <Text
                        fontSize={"sm"}
                        textDecor={"underline"}
                    >
                        Fecha:
                    </Text>

                    <HStack>
                        <Heading size={"md"}>
                            <FaRegCalendar />
                        </Heading>
                        <Heading size={"md"}>
                            {formatted.fecha_init}
                        </Heading>
                    </HStack>
                </VStack>

                {formatted.fecha_fin && (
                    <VStack alignItems={"start"}>
                        <Text
                            fontSize={"sm"}
                            textDecor={"underline"}
                        >
                            Fecha Fin:
                        </Text>

                        <HStack>
                            <Heading size={"md"}>
                                <FaRegCalendar />
                            </Heading>
                            <Heading size={"md"}>
                                {formatted.fecha_fin}
                            </Heading>
                        </HStack>
                    </VStack>
                )}
            </Grid>

            {evento.tipo == "horas-libres" && (
                <Grid
                    gridTemplateColumns={"1fr 1fr"}
                    gap={"1rem"}
                    w={"100%"}
                >
                    <VStack alignItems={"start"}>
                        <Text
                            fontSize={"sm"}
                            textDecor={"underline"}
                        >
                            Hora Inicio:
                        </Text>

                        <HStack>
                            <Heading size={"md"}>
                                <FaRegClock />
                            </Heading>
                            <Heading size={"md"}>
                                {formatted.hora_init}
                            </Heading>
                        </HStack>
                    </VStack>

                    <VStack alignItems={"start"}>
                        <Text
                            fontSize={"sm"}
                            textDecor={"underline"}
                        >
                            Hora Fin:
                        </Text>
                        <HStack>
                            <Heading size={"md"}>
                                <FaRegClock />
                            </Heading>
                            <Heading size={"md"}>
                                {formatted.hora_fin}
                            </Heading>
                        </HStack>
                    </VStack>
                </Grid>
            )}

            {evento.notas && (
                <VStack alignItems={"start"}>
                    <Text
                        fontSize={"sm"}
                        textDecor={"underline"}
                    >
                        Notas:
                    </Text>
                    <Heading size={"md"}>
                        {evento.notas}
                    </Heading>
                </VStack>
            )}

            <HStack>
                {status == "loading" && (
                    <Spinner
                        size={"md"}
                        color={"pink.500"}
                    />
                )}
                {status != "loading" && (
                    <>
                        <Button
                            shadow={"sm"}
                            variant={"subtle"}
                            colorPalette={"blue"}
                            onClick={() => {
                                setCurrentView("tabla");
                                setTimeout(() => {
                                    setCurrentEvento(null);
                                }, 100);
                            }}
                            size={"xs"}
                            fontWeight={700}
                        >
                            Atrás
                        </Button>
                        {evento.status != 0 && (
                            <Button
                                variant={"subtle"}
                                shadow={"sm"}
                                colorPalette={"red"}
                                fontWeight={700}
                                onClick={handleCancelar}
                                size={"xs"}
                            >
                                Cancelar Evento
                            </Button>
                        )}
                    </>
                )}
            </HStack>
        </VStack>
    );
}
