import CalendarioSemanal from "@/components/disponibilidad/CalendarioSemanal";
import ParamsViewer from "@/components/disponibilidad/ParamsViewer";
import SearchParams from "@/components/disponibilidad/SearchParams";
import {
    Box,
    Heading,
    VStack,
    Text,
    useToken,
    Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { SlOptions } from "react-icons/sl";
import { format } from "date-fns";
import { getSemana } from "@/utils/disponibilidad-v1.2";
import { formatFechaDMY } from "@/utils/main";
import { CiCalendarDate } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import { useCurrentCita } from "../nueva-cita/[date]";
import { useRouter } from "next/navigation";
import { loadHook } from "@/utils/lattice-design";

export default function Disponibilidad() {
    const [loader, setLoader] = loadHook("useLoader");
    const [selected, setSelected] = useState({
        lashista: null,
        servicio: null,
        fecha: null,
    });
    const [current, setCurrent] = useState({
        lashista: null,
        servicio: null,
        fecha: null,
        titulo: null,
    });
    const [options, setOptions] = useState({
        lashistas: null,
        servicios: null,
    });
    const [disponibilidad, setDisponibilidad] =
        useState(null);
    const [openParams, setOpenParams] = useState(true);
    const pink = useToken("colors", "pink.600");
    const [daysSemana, setDaysSemana] = useState(null);
    const [title, setTitle] = useState(null);
    const [agendaSemanal, setAgendaSemanal] =
        useState(null);
    const [loading, setLoading] = useState(false);
    const [currentCita, setCurrentCita] = useCurrentCita();
    const router = useRouter();

    useEffect(() => {
        setLoader(false);
        Promise.all([
            axios.get("/api/lashistas"),
            axios.get("/api/servicios"),
        ]).then(([lashistas, servicios]) => {
            setOptions({
                lashistas: lashistas.data,
                servicios: servicios.data,
            });
            setSelected({
                lashista: lashistas.data[0].id,
                servicio: servicios.data[0].id,
                fecha: format(new Date(), "yyyy-MM-dd"),
            });
            setCurrent({
                // lashista: lashistas.data[0].id,
                // servicio: servicios.data[0].id,
                fecha: format(new Date(), "yyyy-MM-dd"),
                titulo: getSemana(
                    format(new Date(), "dd-MM-yyyy")
                ).titulo,
            });
        });
    }, []);

    useEffect(() => {
        if (selected.fecha) {
            const formattedFecha = formatFechaDMY(
                selected.fecha
            );
            const newTitle =
                getSemana(formattedFecha).titulo;
            console.log(newTitle);
            setTitle(newTitle);
            // console.log(daysSemana);
        }
    }, [selected.fecha]);

    function onVerDisponibilidad() {
        transition.start();
        const { lashista, servicio, fecha } = selected;
        const formattedFecha = formatFechaDMY(fecha);
        const daysSemana = getSemana(formattedFecha);
        const { titulo } = daysSemana;
        // console.log(selected.fecha);
        // console.log(formattedFecha);

        setCurrent({
            lashista,
            servicio,
            fecha,
            titulo,
        });

        const promises = daysSemana.dias.map((dia) => {
            return axios.post("/api/citas", {
                fecha: dia.fecha,
                lashista_id: lashista,
                servicio_id: servicio,
                action: "getHorariosDisponibles",
                dev: true,
            });
        });
        Promise.all(promises).then((responses) => {
            // console.log(responses);
            const agendaSemanal = responses.map(
                (response, idx) => {
                    return {
                        disponibles: [...response.data],
                        fecha: daysSemana.dias[idx].fecha,
                        titulo: daysSemana.dias[idx].titulo,
                    };
                }
            );
            console.log(agendaSemanal);
            setAgendaSemanal(agendaSemanal);
            transition.end();
        });
    }

    const transition = {
        start: () => {
            setLoading(true);
            setOpenParams(false);
        },
        end: () => {
            setLoading(false);
            setOpenParams(false);
        },
    };

    const goToAgendar = (hora) => {
        const cita = {
            ...currentCita,
            horario: hora,
            fecha: formatFechaDMY(current.fecha),
            lashista: options.lashistas.find(
                (lashista) =>
                    lashista.id === current.lashista
            ),
            servicio: options.servicios.find(
                (servicio) =>
                    servicio.id === current.servicio
            ),
        };
        setCurrentCita(cita);
        console.log(cita);
        router.push(`/nueva-cita/${cita.fecha}`);
    };

    return (
        <Box w={"100%"}>
            <VStack
                w={"100%"}
                gap={"1rem"}
            >
                <Text
                    fontSize={"2.2rem"}
                    fontWeight={500}
                    mb={"1rem"}
                >
                    {"Horarios Disponibles"}
                </Text>
                {current.titulo ? (
                    current.titulo
                ) : (
                    <span>{"--"}</span>
                )}
                {!loading && (
                    <MenuButton
                        openParams={openParams}
                        setOpenParams={setOpenParams}
                    />
                )}
            </VStack>

            {options.lashistas && options.servicios && (
                <>
                    <SearchParams
                        selected={selected}
                        setSelected={setSelected}
                        options={options}
                        setDaysSemana={setDaysSemana}
                        onVerDisponibilidad={
                            onVerDisponibilidad
                        }
                        openParams={openParams}
                    />
                    {current.lashista &&
                        current.servicio && (
                            <ParamsViewer
                                servicio={options.servicios.find(
                                    (servicio) =>
                                        servicio.id ===
                                        current.servicio
                                )}
                                lashista={options.lashistas.find(
                                    (lashista) =>
                                        lashista.id ===
                                        current.lashista
                                )}
                            />
                        )}
                    {!loading && agendaSemanal && (
                        <CalendarioSemanal
                            agendaSemanal={agendaSemanal}
                            goToAgendar={goToAgendar}
                        />
                    )}

                    {loading && (
                        <VStack
                            w={"100%"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            h={"40vh"}
                        >
                            <Spinner
                                color={"pink.500"}
                                borderWidth="4px"
                                size={"xl"}
                            />
                            <Text mt={"1.5rem"}>
                                {
                                    "Cargando Horarios Disponibles..."
                                }
                            </Text>
                        </VStack>
                    )}
                </>
            )}
        </Box>
    );
}

function MenuButton({ openParams, setOpenParams }) {
    const pink = useToken("colors", "pink.600");
    return (
        <Box
            transition={"all ease 0.3s"}
            _hover={{
                cursor: "pointer",
                transform: "scale(1.1)",
            }}
            style={{
                fontSize: `${
                    openParams ? "1.5rem" : "2.8rem"
                }`,
                cursor: "pointer",
                color: pink,
            }}
            onClick={() => {
                setOpenParams(!openParams);
            }}
        >
            {/* {openParams ? (
                <IoCloseOutline />
            ) : (
                <CiCalendarDate />
            )} */}
            <CiCalendarDate />
        </Box>
    );
}
