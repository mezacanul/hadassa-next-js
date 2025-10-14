import {
    Badge,
    Box,
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
    decodeHorario,
    decodeJSONToHorarioObjects,
    formatEventType,
    getFechaLocal,
} from "@/utils/main";
import { useEffect, useState } from "react";
import axios from "axios";

export default function EventoCard({
    evento,
    setCurrentEvento,
    setCurrentView,
    handleBack,
}) {
    const [horarios, setHorarios] = useState(null);
    const [status, setStatus] = useState("iddle");
    const formatted = formatEventoCard(evento);

    useEffect(() => {
        if (evento.tipo == "cambio-horario") {
            console.log("evento.horarios", evento.horarios);

            let horarios = decodeJSONToHorarioObjects(
                evento.horarios
            );
            console.log(horarios);
            setHorarios(horarios);
        }

        console.log(evento);
    }, [evento]);

    useEffect(() => {
        console.log("horarios", horarios);
    }, [horarios]);

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
                    handleBack(true);
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
            </Grid>

            {evento.tipo == "cambio-horario" &&
                horarios && (
                    <HorariosData horarios={horarios} />
                )}

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
                            onClick={handleBack}
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

function formatEventoCard(evento) {
    return {
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
}

function HorariosData({ horarios }) {
    return (
        <HStack
            alignItems={"start"}
            gap={"2rem"}
        >
            {horarios.map((horario, i) => (
                <HorarioMiniCard
                    key={i}
                    horario={horario}
                />
            ))}
        </HStack>
    );
}

function HorarioMiniCard({ horario }) {
    return (
        <Box
            py={"0.5rem"}
            px={"1rem"}
            // bg={"gray.50"}
            rounded={"md"}
            shadow={"sm"}
            borderColor={"pink.500"}
            borderWidth={"2px"}
        >
            <Text fontWeight={700}>
                {horario.inicio} - {horario.final}
            </Text>
        </Box>
    );
}
