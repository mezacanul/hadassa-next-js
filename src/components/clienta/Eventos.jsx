import {
    Box,
    Button,
    Grid,
    Heading,
    HStack,
    Input,
    Spinner,
    Text,
    Textarea,
    VStack,
} from "@chakra-ui/react";
import SelectEvento from "../lashista/SelectEvento";
import { useEffect, useState } from "react";
import {
    FaCalendar,
    FaCalendarCheck,
} from "react-icons/fa6";
import TablaEventos from "./TablaEventos";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import { format, addDays } from "date-fns";
import axios from "axios";
import { useRouter } from "next/router";
import EventoCard from "./EventoCard";
import { getFechaLocal } from "@/utils/main";

export default function Eventos({ w, lashistaID }) {
    const router = useRouter();
    const [currentView, setCurrentView] = useState("tabla");
    const [eventos, setEventos] = useState(null);
    const [currentEvento, setCurrentEvento] =
        useState(null);

    useEffect(() => {
        if (router.isReady && currentView == "tabla") {
            setEventos(null);
            console.log(lashistaID);
            axios
                .get(`/api/eventos?lashista=${lashistaID}`)
                .then((axiosResp) => {
                    console.log(axiosResp);
                    setEventos(axiosResp.data);
                });
        }
    }, [router.isReady, currentView]);

    // useEffect(() => {
    //     console.log(currentView);
    // }, [currentView]);

    return (
        <VStack
            w={w}
            alignItems={"start"}
            mt={"0.5rem"}
            gap={"1.5rem"}
        >
            <HStack>
                <Heading
                    size={"2xl"}
                    color={"pink.600"}
                >
                    <FaCalendarCheck />
                </Heading>
                <Heading size={"2xl"}>Eventos</Heading>
            </HStack>

            {!eventos && (
                <Spinner
                    size={"md"}
                    color={"pink.500"}
                />
            )}

            {!currentEvento &&
                currentView == "tabla" &&
                eventos && (
                    <TablaEventos
                        title={"Por Venir"}
                        eventos={eventos}
                        setCurrentView={setCurrentView}
                        setCurrentEvento={setCurrentEvento}
                    />
                )}

            {/* {!currentEvento &&
                currentView == "tabla" &&
                eventos && (
                    <TablaEventos
                        title={"Pasados"}
                        eventos={eventos}
                        setCurrentView={setCurrentView}
                        setCurrentEvento={setCurrentEvento}
                    />
                )} */}

            {!currentEvento && currentView == "nuevo" && (
                <NuevoEvento
                    setCurrentView={setCurrentView}
                    lashistaID={lashistaID}
                />
            )}
            {currentEvento && currentView == "evento" && (
                <EventoCard
                    evento={currentEvento}
                    setCurrentEvento={setCurrentEvento}
                    setCurrentView={setCurrentView}
                />
            )}
        </VStack>
    );
}

const today = format(new Date(), "yyyy-MM-dd");
const tomorrow = format(
    addDays(new Date(today), 2),
    "yyyy-MM-dd"
);
const initialForm = {
    titulo: "",
    fecha_init: today,
    fecha_fin: tomorrow,
    hora_init: formatHourMUI("10:00"),
    hora_fin: formatHourMUI("11:00"),
    notas: "",
};

function formatHourMUI(value) {
    return dayjs(`2025-01-01T${value}`);
}

function NuevoEvento({ setCurrentView, lashistaID }) {
    const [status, setStatus] = useState("iddle");
    const [tipoEvento, setTipoEvento] = useState([
        "horas-libres",
    ]);
    const [eventoForm, setEventoForm] =
        useState(initialForm);

    useEffect(() => {
        console.log(new Date());
    }, []);

    function handleAgregar() {
        setStatus("loading");
        const formData = {
            ...eventoForm,
            hora_init: eventoForm.hora_init.format("HH:mm"),
            hora_fin: eventoForm.hora_fin.format("HH:mm"),
            lashistaID,
            tipo: tipoEvento[0],
        };
        axios
            .post("/api/eventos", formData)
            .then((axiosResp) => {
                setStatus("success");
                console.log(axiosResp);
            });
        console.log(formData);
    }

    return (
        <VStack w={"100%"}>
            <VStack
                display={
                    status != "success" ? "flex" : "none"
                }
                alignItems={"start"}
                w={"100%"}
                gap={"1rem"}
            >
                <HStack
                    w={"100%"}
                    alignItems={"end"}
                    justifyContent={"start"}
                    gap={"1rem"}
                >
                    <Heading
                        mt={"0.5rem"}
                        size={"md"}
                        fontWeight={400}
                        textDecor={"underline"}
                    >
                        Nuevo Evento:
                    </Heading>
                    <Heading
                        size={"xl"}
                        color={"pink.600"}
                        // textDecor={"underline"}
                    >
                        {getFechaLocal(
                            eventoForm.fecha_init
                        )}
                    </Heading>
                </HStack>

                <VStack
                    alignItems={"start"}
                    w={"100%"}
                >
                    <Text
                        fontWeight={700}
                        fontSize={"sm"}
                    >
                        Tipo:
                    </Text>
                    <SelectEvento
                        tipoEvento={tipoEvento}
                        setTipoEvento={setTipoEvento}
                    />
                </VStack>

                <Grid
                    w={"100%"}
                    gridTemplateColumns={
                        tipoEvento == "temporada-libre"
                            ? "1fr 1fr"
                            : "1fr"
                    }
                    gap={"1rem"}
                >
                    <VStack alignItems={"start"}>
                        <Text
                            fontWeight={700}
                            fontSize={"sm"}
                        >
                            Fecha{" "}
                            {tipoEvento != "temporada-libre"
                                ? ""
                                : " Inicio"}
                            :
                        </Text>
                        <Input
                            value={eventoForm.fecha_init}
                            shadow={"sm"}
                            bg={"white"}
                            type="date"
                            onChange={(e) => {
                                console.log(e.target.value);
                                setEventoForm({
                                    ...eventoForm,
                                    fecha_init:
                                        e.target.value,
                                });
                            }}
                        />
                    </VStack>

                    {tipoEvento == "temporada-libre" && (
                        <VStack alignItems={"start"}>
                            <Text
                                fontWeight={700}
                                fontSize={"sm"}
                            >
                                Fecha Fin:
                            </Text>
                            <Input
                                value={eventoForm.fecha_fin}
                                shadow={"sm"}
                                bg={"white"}
                                type="date"
                                onChange={(e) => {
                                    console.log(
                                        e.target.value
                                    );
                                    setEventoForm({
                                        ...eventoForm,
                                        fecha_fin:
                                            e.target.value,
                                    });
                                }}
                                placeholder="01/01/2025"
                            />
                        </VStack>
                    )}
                </Grid>

                {tipoEvento == "horas-libres" && (
                    <Grid
                        w={"100%"}
                        gridTemplateColumns={"1fr 1fr"}
                        gap={"1rem"}
                    >
                        <Heading size={"sm"}>
                            Hora Inicio:
                        </Heading>
                        <Heading size={"sm"}>
                            Hora Fin:
                        </Heading>
                        <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                        >
                            <TimePicker
                                sx={{
                                    width: "100%",
                                    backgroundColor:
                                        "white",
                                }}
                                label={"De"}
                                value={eventoForm.hora_init}
                                onChange={(newValue) => {
                                    setEventoForm({
                                        ...eventoForm,
                                        hora_init:
                                            formatHourMUI(
                                                newValue.format(
                                                    "HH:mm"
                                                )
                                            ),
                                    });
                                    console.log(newValue);
                                }}
                                timeSteps={{
                                    minutes: 15,
                                }}
                            />
                        </LocalizationProvider>

                        <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                        >
                            <TimePicker
                                sx={{
                                    width: "100%",
                                    backgroundColor:
                                        "white",
                                }}
                                label={"A"}
                                value={eventoForm.hora_fin}
                                onChange={(newValue) => {
                                    setEventoForm({
                                        ...eventoForm,
                                        hora_fin:
                                            formatHourMUI(
                                                newValue.format(
                                                    "HH:mm"
                                                )
                                            ),
                                    });
                                    console.log(newValue);
                                }}
                                timeSteps={{
                                    minutes: 15,
                                }}
                            />
                        </LocalizationProvider>
                    </Grid>
                )}

                {/* <VStack w={"100%"} mt={"2rem"}> */}
                <Input
                    shadow={"sm"}
                    bg={"white"}
                    type="text"
                    placeholder="Titulo..."
                    value={eventoForm.titulo}
                    onChange={(e) => {
                        setEventoForm({
                            ...eventoForm,
                            titulo: e.target.value,
                        });
                    }}
                />

                <Textarea
                    size={"xl"}
                    shadow={"sm"}
                    bg={"white"}
                    placeholder="Notas"
                    value={eventoForm.notas}
                    onChange={(e) => {
                        setEventoForm({
                            ...eventoForm,
                            notas: e.target.value,
                        });
                    }}
                />
                {/* </VStack> */}

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
                                onClick={() => {
                                    setCurrentView("tabla");
                                }}
                                bg={"gray.600"}
                            >
                                Cancelar
                            </Button>
                            <Button
                                shadow={"sm"}
                                bg={"pink.500"}
                                onClick={handleAgregar}
                            >
                                Agregar
                            </Button>
                        </>
                    )}
                </HStack>

                {status == "error" && (
                    <Text color={"red"}>Error</Text>
                )}
            </VStack>

            {status == "success" && (
                <VStack
                    w={"100%"}
                    my={"2.5rem"}
                    gap={"1.5rem"}
                >
                    <Text color={"green"}>
                        ¡Evento Agregado Exitosamente!
                    </Text>
                    <Text
                        _hover={{
                            cursor: "pointer",
                        }}
                        textDecor={"underline"}
                        onClick={() => {
                            setCurrentView("tabla");
                        }}
                    >
                        Atrás
                    </Text>
                </VStack>
            )}
        </VStack>
    );
}

const eventosData = [
    {
        id: "abc123",
        title: "Curso",
        notes: "Peinado de pestañas",
        fecha_init: "04/06/2025",
        fecha_fin: null,
        hora_init: "10:00",
        hora_fin: "13:00",
        tipo: "horas-libres",
    },
    {
        id: "abc124",
        title: "Descanso",
        notes: "",
        fecha_init: "05/06/2025",
        fecha_fin: null,
        hora_init: "10:00",
        hora_fin: "13:00",
        tipo: "dia-libre",
    },
    {
        id: "abc125",
        title: "Vacaciones",
        notes: "",
        fecha_init: "06/06/2025",
        fecha_fin: "10/06/2025",
        hora_init: null,
        hora_fin: null,
        tipo: "temporada-libre",
    },
];
