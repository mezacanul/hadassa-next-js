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
import {
    decodeHorario,
    encodeHorarios,
    getFechaLocal,
    getHorarioObject,
} from "@/utils/main";
import { Form } from "react-bootstrap";

export default function Eventos({ w, lashistaID }) {
    const router = useRouter();
    const [currentView, setCurrentView] = useState("tabla");
    const [eventos, setEventos] = useState(null);
    const [currentEvento, setCurrentEvento] =
        useState(null);

    useEffect(() => {
        // if (router.isReady && currentView == "tabla") {
        // setEventos(null);
        console.log(lashistaID);
        fetchEventos();
        // }
    }, []);

    function handleBack(reload = false) {
        setCurrentView("tabla");
        // setTimeout(() => {
        setCurrentEvento(null);
        // }, 50);
        if (reload == true) {
            setEventos(null);
            fetchEventos();
        }
    }

    function fetchEventos() {
        axios
            .get(`/api/eventos?lashista=${lashistaID}`)
            .then((axiosResp) => {
                console.log(axiosResp);
                setEventos(axiosResp.data);
            });
    }

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

            {!currentEvento && currentView == "nuevo" && (
                <NuevoEvento
                    setCurrentView={setCurrentView}
                    lashistaID={lashistaID}
                    handleBack={handleBack}
                />
            )}
            {currentEvento && currentView == "evento" && (
                <EventoCard
                    evento={currentEvento}
                    setCurrentEvento={setCurrentEvento}
                    setCurrentView={setCurrentView}
                    handleBack={handleBack}
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
    horarios: [{ inicio: "09:30", final: "18:00" }],
    notas: "",
};

function formatHourMUI(value) {
    return dayjs(`2025-01-01T${value}`);
}

function NuevoEvento({
    setCurrentView,
    lashistaID,
    handleBack,
}) {
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
        const tipo = tipoEvento[0];
        const {
            horarios,
            hora_init,
            hora_fin,
            titulo,
            notas,
        } = eventoForm;
        const horariosJSON =
            tipo == "cambio-horario"
                ? JSON.stringify(
                      horarios.map(
                          (hora) =>
                              `${hora.inicio} - ${hora.final}`
                      )
                  )
                : null;

        const formData = {
            ...eventoForm,
            titulo:
                titulo != ""
                    ? titulo
                    : tipo == "cambio-horario"
                    ? "Cambio de Horario"
                    : "No Disponible",
            notas: notas != "" ? notas : null,
            fecha_fin: null,
            hora_init:
                tipo == "horas-libres"
                    ? hora_init.format("HH:mm")
                    : null,
            hora_fin:
                tipo == "horas-libres"
                    ? hora_fin.format("HH:mm")
                    : null,
            lashistaID,
            tipo,
            horarios: horariosJSON,
        };
        console.log(formData);
        // setStatus("success");
        // return;
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
                <TituloEvento eventoForm={eventoForm} />

                <Grid
                    w={"100%"}
                    gridTemplateColumns={"1fr 1fr"}
                    gap={"1rem"}
                >
                    <FechaEvento
                        eventoForm={eventoForm}
                        setEventoForm={setEventoForm}
                    />
                    <SelectTipo
                        tipoEvento={tipoEvento}
                        setTipoEvento={setTipoEvento}
                    />
                </Grid>

                {tipoEvento == "cambio-horario" && (
                    <SelectNuevoHorario
                        eventoForm={eventoForm}
                        setEventoForm={setEventoForm}
                    />
                )}

                {tipoEvento == "horas-libres" && (
                    <SelectHorasLibres
                        eventoForm={eventoForm}
                        setEventoForm={setEventoForm}
                    />
                )}

                {/* Titulo y Notas */}
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

                <HStack
                    w={"100%"}
                    justifyContent={"between"}
                >
                    <Text
                        fontSize={"sm"}
                        color={"red"}
                    >
                        {
                            "Esta acción cancelará todos los eventos actuales para la fecha seleccionada"
                        }
                    </Text>
                    <HStack
                        w={"100%"}
                        justifyContent={"end"}
                    >
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
                                    onClick={handleBack}
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
                        onClick={() => handleBack(true)}
                    >
                        Atrás
                    </Text>
                </VStack>
            )}
        </VStack>
    );
}

function TituloEvento({ eventoForm }) {
    return (
        <VStack
            w={"100%"}
            alignItems={"start"}
            justifyContent={"start"}
            gap={"0.5rem"}
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
                {getFechaLocal(eventoForm.fecha_init)}
            </Heading>
        </VStack>
    );
}

function SelectTipo({ tipoEvento, setTipoEvento }) {
    return (
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
    );
}

function FechaEvento({ eventoForm, setEventoForm }) {
    return (
        <VStack
            alignItems={"start"}
            w={"100%"}
        >
            <Text
                fontWeight={700}
                fontSize={"sm"}
            >
                {"Fecha:"}
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
                        fecha_init: e.target.value,
                    });
                }}
            />
        </VStack>
    );
}

function SelectNuevoHorario({ eventoForm, setEventoForm }) {
    const selectHorarioStyle = {
        width: "50%",
        padding: "0.5rem",
        borderRadius: "0.2rem",
        boxShadow:
            "0px 2px 2px 2px rgba(108, 108, 108, 0.1)",
    };

    function handleChange(newValue, index, type) {
        setEventoForm({
            ...eventoForm,
            horarios: eventoForm.horarios.map((hora, i) => {
                if (i == index) {
                    return {
                        ...hora,
                        [type]: newValue,
                    };
                }
                return hora;
            }),
        });
    }

    function handleAdd() {
        setEventoForm({
            ...eventoForm,
            horarios: [
                ...eventoForm.horarios,
                { inicio: "09:30", final: "18:00" },
            ],
        });
    }
    function handleDelete() {
        setEventoForm({
            ...eventoForm,
            horarios: eventoForm.horarios.filter(
                (_, i) => i !== 0
            ),
        });
    }
    return (
        <VStack
            w={"100%"}
            alignItems={"start"}
        >
            <Heading size={"sm"}>
                {"Nuevo Horario:"}
            </Heading>
            {eventoForm.horarios &&
                eventoForm.horarios.map((hora, i) => (
                    <HStack
                        w={"100%"}
                        key={i}
                    >
                        <Form.Control
                            style={selectHorarioStyle}
                            type="time"
                            value={
                                eventoForm.horarios[i]
                                    .inicio
                            }
                            onChange={(e) => {
                                handleChange(
                                    e.target.value,
                                    i,
                                    "inicio"
                                );
                            }}
                            step={"1800"}
                        />
                        <Form.Control
                            style={selectHorarioStyle}
                            type="time"
                            value={
                                eventoForm.horarios[i].final
                            }
                            onChange={(e) => {
                                handleChange(
                                    e.target.value,
                                    i,
                                    "final"
                                );
                            }}
                        />
                    </HStack>
                ))}
            <HStack
                w={"100%"}
                justifyContent={"end"}
            >
                <Button
                    size={"sm"}
                    bg={"pink.500"}
                    fontSize={"xl"}
                    onClick={handleDelete}
                    disabled={
                        eventoForm.horarios.length == 1
                    }
                >
                    {"-"}
                </Button>
                <Button
                    size={"sm"}
                    bg={"pink.500"}
                    fontSize={"xl"}
                    onClick={handleAdd}
                    disabled={
                        eventoForm.horarios.length == 2
                    }
                >
                    {"+"}
                </Button>
            </HStack>
        </VStack>
    );
}
function SelectHorasLibres({ eventoForm, setEventoForm }) {
    return (
        <Grid
            w={"100%"}
            gridTemplateColumns={"1fr 1fr"}
            gap={"1rem"}
        >
            <Heading size={"sm"}>Hora Inicio:</Heading>
            <Heading size={"sm"}>Hora Fin:</Heading>
            <LocalizationProvider
                dateAdapter={AdapterDayjs}
            >
                <TimePicker
                    sx={{
                        width: "100%",
                        backgroundColor: "white",
                    }}
                    label={"De"}
                    value={eventoForm.hora_init}
                    onChange={(newValue) => {
                        setEventoForm({
                            ...eventoForm,
                            hora_init: formatHourMUI(
                                newValue.format("HH:mm")
                            ),
                        });
                        console.log(newValue);
                    }}
                    timeSteps={{
                        minutes: 30,
                    }}
                />
            </LocalizationProvider>

            <LocalizationProvider
                dateAdapter={AdapterDayjs}
            >
                <TimePicker
                    sx={{
                        width: "100%",
                        backgroundColor: "white",
                    }}
                    label={"A"}
                    value={eventoForm.hora_fin}
                    onChange={(newValue) => {
                        setEventoForm({
                            ...eventoForm,
                            hora_fin: formatHourMUI(
                                newValue.format("HH:mm")
                            ),
                        });
                        console.log(newValue);
                    }}
                    timeSteps={{
                        minutes: 30,
                    }}
                />
            </LocalizationProvider>
        </Grid>
    );
}
