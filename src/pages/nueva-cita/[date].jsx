import {
    Box,
    Button,
    Heading,
    HStack,
    Text,
    VStack,
    Card,
    Image,
    Badge,
    Grid,
    GridItem,
    Spinner,
    Input,
    Alert,
    Select,
    Portal,
    createListCollection,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
    loadHook,
    Singleton,
} from "@/utils/lattice-design";
import {
    formatFechaDMY,
    formatHoyTitle,
    getDateObject,
} from "@/utils/main";
import axios from "axios";
import { FaCreditCard } from "react-icons/fa6";
import { FaMoneyBill } from "react-icons/fa";
import OrderSummary from "@/components/agendar-cita/OrderSummary";
import { CDN } from "@/config/cdn";
import LashistaCard from "@/components/lashista/LashistaCard";
import TablaClientas from "@/components/agendar-cita/SelectClientas/TablaClientas";
import { SelectClientas } from "@/components/agendar-cita/SelectClientas";

const useSearchServicio = Singleton("");
export const useSearchTerm = Singleton("");
export const useCurrentCita = Singleton({
    servicio: null,
    lashista: null,
    clienta: null,
    fecha: null,
    horario: null,
});

export default function NuevaCita() {
    const router = useRouter();
    const { date } = router.query;
    const [DOM, setDOM] = loadHook("useDOM");
    const [selectedDate, setSelectedDate] = loadHook(
        "useSelectedDate"
    );
    const [currentCita, setCurrentCita] = useCurrentCita();

    const [servicios, setServicios] = useState(null);
    const [lashistas, setLashistas] = useState(null);
    // const [horarios, setHorarios] = useState(null);
    // const [clientas, setClientas] = useState(null);

    const [currentPaso, setCurrentPaso] =
        useState("Servicio");
    const [clientasState, setClientasState] =
        useState("buscar");
    const [loading, setLoading] = loadHook("useLoader");

    const [dateObj, setDateObj] = useState(null);

    useEffect(() => {
        if (selectedDate) {
            setDateObj(getDateObject(selectedDate));
        }
    }, [selectedDate]);

    useEffect(() => {
        setDOM({ title: "Agendar Cita" });

        Promise.all([
            axios.get("/api/servicios"),
            axios.get("/api/lashistas"),
        ]).then(([serviciosResp, lashistasResp]) => {
            setServicios(serviciosResp.data);
            setLashistas(lashistasResp.data);
            console.log(
                serviciosResp.data,
                lashistasResp.data
            );
        });

        setLoading(false);
        return () => {
            useCurrentCita.reset();
        };
    }, []);

    useEffect(() => {
        if (currentCita.servicio && !currentCita.lashista) {
            setCurrentPaso("Lashista");
        }
        if (
            currentCita.servicio &&
            currentCita.lashista &&
            !currentCita.horario
        ) {
            setCurrentPaso("Horario");
        }
        if (
            currentCita.servicio &&
            currentCita.lashista &&
            currentCita.horario &&
            !currentCita.clienta
        ) {
            setCurrentPaso("Clienta");
        }
    }, [currentCita]);

    useEffect(() => {
        if (router.isReady) {
            setCurrentCita({ ...currentCita, fecha: date });
            if (selectedDate == null) {
                const formattedFecha = formatFechaDMY(date);
                setSelectedDate(formattedFecha);
                // const [day, month, year] = date.split("-");
                // const formattedDate = `${year}-${month}-${day}`;
                // setSelectedDate(formattedDate);
            }
        }
    }, [router.isReady, date]);

    return (
        <Box
            w={"100%"}
            mb={"2rem"}
            h={"85vh"}
        >
            <Heading
                textAlign={
                    currentCita.servicio &&
                    currentCita.lashista &&
                    currentCita.horario &&
                    currentPaso == "Confirmar" &&
                    currentCita.clienta
                        ? "center"
                        : "left"
                }
                fontWeight={300}
                size={"3xl"}
                mb={"1rem"}
            >
                {/* {formatHoyTitle(selectedDate)} */}
                {dateObj &&
                    `${dateObj.dayName} de ${dateObj.monthYearFormat}`}
            </Heading>

            {currentCita.servicio &&
            currentCita.lashista &&
            currentCita.horario &&
            currentPaso == "Confirmar" &&
            currentCita.clienta ? null : (
                <Heading
                    color={"pink.600"}
                    mb={"2rem"}
                >
                    Seleccionar {currentPaso}:
                </Heading>
            )}

            <HStack
                w={"100%"}
                justify={
                    currentCita.servicio &&
                    currentCita.lashista &&
                    currentCita.horario &&
                    currentCita.clienta
                        ? "center"
                        : "space-between"
                }
                gap={"2rem"}
                align={"start"}
            >
                {currentCita.servicio &&
                currentCita.lashista &&
                currentCita.horario &&
                currentPaso == "Confirmar" &&
                currentCita.clienta ? null : (
                    <VStack
                        style={{ width: "65%" }}
                        align={"start"}
                    >
                        {currentCita.servicio &&
                            currentCita.lashista &&
                            currentCita.horario &&
                            !currentCita.clienta && (
                                <ActionsClienta
                                    clientasState={
                                        clientasState
                                    }
                                    setClientasState={
                                        setClientasState
                                    }
                                    currentPaso={
                                        currentPaso
                                    }
                                />
                            )}
                        {!currentCita.servicio && (
                            <SearchServicio />
                        )}

                        <Box
                            w={"100%"}
                            maxH={"65vh"}
                            overflowY={"scroll"}
                        >
                            {!currentCita.servicio && (
                                <SelectServicios
                                    servicios={servicios}
                                />
                            )}
                            {lashistas &&
                                currentCita.servicio &&
                                !currentCita.lashista && (
                                    <SelectLashistas
                                        lashistas={
                                            lashistas
                                        }
                                        selectedDate={
                                            selectedDate
                                        }
                                    />
                                )}
                            {currentCita.servicio &&
                                currentCita.lashista &&
                                !currentCita.horario && (
                                    <SelectHorarios
                                        currentCita={
                                            currentCita
                                        }
                                        selectedDate={
                                            selectedDate
                                        }
                                    />
                                )}

                            {currentCita.servicio &&
                                currentCita.lashista &&
                                currentCita.horario && (
                                    // !currentCita.clienta && (
                                    <SelectClientas
                                        clientasState={
                                            clientasState
                                        }
                                        setClientasState={
                                            setClientasState
                                        }
                                        setCurrentPaso={
                                            setCurrentPaso
                                        }
                                        currentPaso={
                                            currentPaso
                                        }
                                    />
                                )}
                        </Box>
                    </VStack>
                )}

                <OrderSummary
                    dateObj={dateObj}
                    setClientasState={setClientasState}
                    setCurrentPaso={setCurrentPaso}
                    stage={currentPaso}
                    disabled={
                        currentCita.servicio &&
                        currentCita.lashista &&
                        currentCita.horario &&
                        currentCita.clienta
                            ? false
                            : true
                    }
                />
            </HStack>
        </Box>
    );
}

export function ActionsClienta({
    clientasState,
    setClientasState,
    currentPaso,
}) {
    const [searchTerm, setSearchTerm] = useSearchTerm();
    const handleChange = (e) =>
        setSearchTerm(e.target.value);

    return (
        <Grid
            w={"100%"}
            mb={"1rem"}
            gridTemplateColumns={"repeat(2, 1fr)"}
            gap={"2rem"}
        >
            <Input
                disabled={
                    clientasState == "buscar" ? false : true
                }
                shadow={"md"}
                bg={"white"}
                size={"sm"}
                placeholder="Buscar"
                value={searchTerm}
                onChange={handleChange}
            />
            {currentPaso != "Lista" && (
                <GridItem alignSelf={"start"}>
                    <Button
                        disabled={
                            clientasState == "buscar"
                                ? false
                                : true
                        }
                        onClick={() => {
                            setClientasState("nueva");
                        }}
                        size={"sm"}
                        bg={"pink.500"}
                    >
                        Nueva
                    </Button>
                </GridItem>
            )}
        </Grid>
    );
}

function SelectLashistas({ lashistas, selectedDate }) {
    const [disponibles, setDisponibles] = useState(null);
    const [currentCita, setCurrentCita] = useCurrentCita();
    const send = {
        fecha: formatFechaDMY(selectedDate),
        servicio_id: currentCita.servicio.id,
        action: "getHorariosDisponibles",
        dev: true,
        lashista_id: null,
        // lashista_id: currentCita.lashista.id,
    };

    useEffect(() => {
        const promises = [];
        lashistas.forEach((lsh) => {
            promises.push(
                axios.post("/api/citas", {
                    ...send,
                    lashista_id: lsh.id,
                })
            );
        });
        Promise.all(promises)
            .then((responses) => {
                const available = responses.map((resp) => {
                    return resp.data.length;
                });
                console.log(available);
                setDisponibles(available);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        // console.log(promises);
    }, []);

    return (
        <Grid
            w="100%"
            gridTemplateColumns={"1fr 1fr 1fr"}
            gap={"2rem"}
            pb={"1rem"}
        >
            {!disponibles && (
                <Spinner
                    color="pink.500"
                    borderWidth="4px"
                    size={"lg"}
                />
            )}
            {disponibles &&
                lashistas.map((lashista, i) => {
                    return (
                        <GridItem
                            key={lashista.id}
                            display={
                                disponibles[i] > 0
                                    ? "initial"
                                    : "none"
                            }
                        >
                            <LashistaCard data={lashista} />
                        </GridItem>
                    );
                })}
        </Grid>
    );
}

function SearchServicio() {
    const [searchServicio, setSearchServicio] =
        useSearchServicio();
    const handleChange = (e) =>
        setSearchServicio(e.target.value);

    return (
        <Grid
            w="100%"
            mb={"1rem"}
            gridTemplateColumns={"repeat(2, 1fr)"}
            gap={"2rem"}
        >
            <Input
                shadow={"md"}
                bg={"white"}
                size={"sm"}
                placeholder="Buscar Servicio"
                value={searchServicio}
                onChange={handleChange}
            />
        </Grid>
    );
}

function SelectServicios({ servicios }) {
    const [searchServicio, setSearchServicio] =
        useSearchServicio();
    useEffect(() => {
        return setSearchServicio("");
    }, []);
    return (
        <>
            {!servicios && (
                <Spinner
                    color="pink.500"
                    borderWidth="4px"
                    size={"xl"}
                />
            )}
            <Grid
                w="100%"
                gridTemplateColumns={"repeat(2, 1fr)"}
                gap={"2rem"}
            >
                {servicios &&
                    servicios
                        .filter((servicio) =>
                            servicio.servicio
                                .toLowerCase()
                                .includes(
                                    searchServicio.toLowerCase()
                                )
                        )
                        .map((servicio) => {
                            return (
                                <GridItem key={servicio.id}>
                                    <ServicioCard
                                        data={servicio}
                                    />
                                </GridItem>
                            );
                        })}
            </Grid>
        </>
    );
}

function SelectHorarios({ selectedDate }) {
    const [currentCita, setCurrentCita] = useCurrentCita();
    const [horarios, setHorarios] = useState(null);

    useEffect(() => {
        const send = {
            fecha: formatFechaDMY(selectedDate),
            servicio_id: currentCita.servicio.id,
            lashista_id: currentCita.lashista.id,
            action: "getHorariosDisponibles",
            dev: true,
        };
        console.log("send", send);
        console.log(JSON.stringify(send));

        axios
            .post("/api/citas", send)
            .then((horariosResp) => {
                // const uniqueTimeSlots = getUniqueTimeSlots(
                //     horariosResp.data.horariosDispPorCama
                // );
                console.log(horariosResp.data);
                // console.log(uniqueTimeSlots);
                setHorarios(horariosResp.data);
            });
    }, []);

    return (
        <HStack
            justify={"center"}
            h={"50vh"}
            align={"center"}
            w={"100%"}
        >
            {!horarios && (
                <Spinner
                    color="pink.500"
                    borderWidth="4px"
                    size={"lg"}
                />
            )}

            {horarios && horarios.length == 0 && (
                <Heading
                    w={"100%"}
                    textAlign={"center"}
                >
                    No hay horarios disponibles
                </Heading>
            )}

            {horarios && horarios.length > 0 && (
                <Grid
                    gridTemplateColumns={"repeat(4, 1fr)"}
                    gap={"1.5rem"}
                    w={"75%"}
                >
                    {horarios.map((hr) => {
                        return (
                            <Button
                                size={"lg"}
                                onClick={() => {
                                    setCurrentCita({
                                        ...currentCita,
                                        horario: hr,
                                    });
                                    console.log(hr);
                                }}
                                bg={"pink.500"}
                                key={hr.hora}
                            >
                                {hr.hora
                                    .replace("-", "*")
                                    .replace("+", "*")}
                            </Button>
                            // <Heading key={hr.hora}>{hr.hora}</Heading>
                        );
                        // return <Badge key={hr}>{hr}</Badge>;
                    })}
                </Grid>
            )}
        </HStack>
    );
}

function ServicioCard({ data }) {
    const [currentCita, setCurrentCita] = useCurrentCita();
    return (
        <Card.Root
            overflow="hidden"
            size="sm"
            shadow={"md"}
        >
            <Image
                objectFit="cover"
                // maxW="5rem"
                maxH={"10rem"}
                src={`${CDN}/img/servicios/${data.image}`}
                alt="Caffe Latte"
            />
            <Box>
                <Card.Body>
                    <Card.Title
                        mb="2"
                        color={"pink.600"}
                    >
                        {data.servicio}
                        {data.tipo.includes("combo") && (
                            <Badge
                                size={"md"}
                                ms={"0.5rem"}
                                colorPalette={"purple"}
                            >
                                Combo
                            </Badge>
                        )}
                        {data.tipo == "combo-hadassa" && (
                            <Badge
                                size={"md"}
                                ms={"0.5rem"}
                                colorPalette={"purple"}
                            >
                                Hadassa
                            </Badge>
                        )}
                    </Card.Title>
                    <Card.Description>
                        {data.descripcion}
                    </Card.Description>
                </Card.Body>
                <Card.Footer
                    justifyContent={"space-between"}
                    mt="4"
                    alignItems={"end"}
                >
                    <HStack alignItems={"end"}>
                        <VStack>
                            <Badge colorPalette={"green"}>
                                <FaMoneyBill />$
                                {data.precio}
                            </Badge>
                            <Badge colorPalette={"blue"}>
                                <FaCreditCard />$
                                {data.precio_tarjeta}
                            </Badge>
                        </VStack>
                        <Badge colorPalette={"blue"}>
                            {data.minutos} minutos
                        </Badge>
                    </HStack>
                    <Button
                        size={"sm"}
                        bg={"pink.500"}
                        onClick={() => {
                            setCurrentCita({
                                ...currentCita,
                                servicio: data,
                            });
                        }}
                    >
                        Seleccionar
                    </Button>
                </Card.Footer>
            </Box>
        </Card.Root>
    );
}