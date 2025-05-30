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
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { loadHook, Singleton } from "@/utils/lattice-design";
import { formatFechaDMY, formatHoyTitle } from "@/utils/main";
import { sortHours } from "@/utils/disponibilidad";
import axios from "axios";
import { parse, format } from "date-fns";
import { es } from "date-fns/locale";

import { LuBedSingle, LuReceiptText, LuCalendar1 } from "react-icons/lu";
import { FaRegClock } from "react-icons/fa";
import { IoPersonOutline } from "react-icons/io5";
import { PiCashRegisterBold } from "react-icons/pi";
import { FaRegSquareMinus } from "react-icons/fa6";
import { BsWhatsapp } from "react-icons/bs";

export const useCurrentCita = Singleton({
    servicio: null,
    lashista: null,
    horario: null,
    clienta: null,
    fecha: null,
});

// export const useCurrentCita = Singleton(null)

export default function NuevaCita() {
    const router = useRouter();
    const { date } = router.query;
    const [DOM, setDOM] = loadHook("useDOM");
    const [selectedDate, setSelectedDate] = loadHook("useSelectedDate");
    const [currentCita, setCurrentCita] = useCurrentCita();

    const [servicios, setServicios] = useState(null);
    const [lashistas, setLashistas] = useState(null);
    // const [horarios, setHorarios] = useState(null);
    // const [clientas, setClientas] = useState(null);

    const [currentPaso, setCurrentPaso] = useState("Servicio");
    const [clientasState, setClientasState] = useState("buscar");

    useEffect(() => {
        setDOM({ title: "Agendar Cita" });

        Promise.all([
            axios.get("/api/servicios"),
            axios.get("/api/lashistas"),
        ]).then(([serviciosResp, lashistasResp]) => {
            setServicios(serviciosResp.data);
            setLashistas(lashistasResp.data);
            console.log(serviciosResp.data, lashistasResp.data);
        });

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
        <Box w={"100%"} mb={"2rem"} h={"85vh"}>
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
                size={"4xl"}
                mb={"2rem"}
            >
                Agendar Cita
            </Heading>

            {currentCita.servicio &&
            currentCita.lashista &&
            currentCita.horario &&
            currentPaso == "Confirmar" &&
            currentCita.clienta ? null : (
                <Heading color={"pink.600"} mb={"2rem"}>
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
                    <VStack style={{ width: "65%" }} align={"start"}>
                        {currentCita.servicio &&
                            currentCita.lashista &&
                            currentCita.horario &&
                            !currentCita.clienta && (
                                <ActionsClienta
                                    clientasState={clientasState}
                                    setClientasState={setClientasState}
                                />
                            )}

                        <Box w={"100%"} maxH={"65vh"} overflowY={"scroll"}>
                            {servicios && !currentCita.servicio && (
                                <SelectServicios servicios={servicios} />
                            )}
                            {lashistas &&
                                currentCita.servicio &&
                                !currentCita.lashista && (
                                    <SelectLashistas lashistas={lashistas} />
                                )}
                            {currentCita.servicio &&
                                currentCita.lashista &&
                                !currentCita.horario && (
                                    <SelectHorarios
                                        currentCita={currentCita}
                                        selectedDate={selectedDate}
                                    />
                                )}

                            {currentCita.servicio &&
                                currentCita.lashista &&
                                currentCita.horario && (
                                    // !currentCita.clienta && (
                                    <SelectClientas
                                        clientasState={clientasState}
                                        setClientasState={setClientasState}
                                        setCurrentPaso={setCurrentPaso}
                                    />
                                )}
                        </Box>
                    </VStack>
                )}

                <OrderSummary
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

function ActionsClienta({ clientasState, setClientasState }) {
    return (
        <Grid
            w={"100%"}
            mb={"1rem"}
            gridTemplateColumns={"repeat(2, 1fr)"}
            gap={"2rem"}
        >
            <Input
                disabled={clientasState == "buscar" ? false : true}
                shadow={"md"}
                bg={"white"}
                size={"sm"}
                placeholder="Buscar"
            />
            <GridItem alignSelf={"start"}>
                <Button
                    disabled={clientasState == "buscar" ? false : true}
                    onClick={() => {
                        setClientasState("nueva");
                    }}
                    size={"sm"}
                    bg={"pink.500"}
                >
                    Nueva
                </Button>
            </GridItem>
        </Grid>
    );
}

function OrderSummary({ disabled, setCurrentPaso }) {
    const [citaID, setCitaID] = useState(null);
    const [selectedDate, setSelectedDate] = loadHook("useSelectedDate");
    const [currentCita, setCurrentCita] = useCurrentCita();

    const handleAgendar = () => {
        console.log(currentCita);
        axios
            .post("/api/citas", { ...currentCita, action: "agendar" })
            .then((citasResp) => {
                console.log(citasResp);
                if (citasResp.status == 201 && citasResp.data.uuid) {
                    setCitaID(citasResp.data.uuid);
                }
            });
    };

    const handleCurrentCita = (stage) => {
        switch (stage) {
            case "Servicio":
                setCurrentCita({
                    ...currentCita,
                    servicio: null,
                    lashista: null,
                    horario: null,
                    clienta: null,
                });
                break;
            case "Lashista":
                setCurrentCita({
                    ...currentCita,
                    lashista: null,
                    horario: null,
                    clienta: null,
                });
                break;
            case "Horario":
                setCurrentCita({
                    ...currentCita,
                    horario: null,
                    clienta: null,
                });
                break;
            case "Clienta":
                setCurrentCita({
                    ...currentCita,
                    clienta: null,
                });
                break;
            default:
                break;
        }
        setCurrentPaso(stage);
        console.log(stage);
    };

    return (
        <VStack style={{ width: "35%" }} bg={"white"} p={"2rem"} shadow={"md"}>
            <Heading color={"pink.600"}>Resumen</Heading>

            <VStack
                w={"100%"}
                align={"start"}
                gap={"1.5rem"}
                mt={"1rem"}
                mb={"3rem"}
            >
                <HStack w={"100%"} justify={"space-between"}>
                    <HStack>
                        <LuCalendar1 />
                        <Text>Fecha: </Text>
                    </HStack>
                    <Text
                        textDecor={"underline"}
                        fontWeight={700}
                        color={"pink.600"}
                    >
                        {/* {selectedDate && formatFechaDMY(selectedDate)} */}
                        {selectedDate && formatHoyTitle(selectedDate)}
                    </Text>
                </HStack>

                <HStack w={"100%"} justify={"space-between"}>
                    <HStack>
                        <LuReceiptText />
                        <Text>Servicio: </Text>
                    </HStack>
                    <HStack>
                        {currentCita.servicio && (
                            <Text
                                _hover={{
                                    cursor: "pointer",
                                }}
                            >
                                <FaRegSquareMinus
                                    onClick={() => {
                                        handleCurrentCita("Servicio");
                                    }}
                                />
                            </Text>
                        )}
                        <Text
                            textDecor={
                                currentCita.servicio ? "underline" : "none"
                            }
                            fontWeight={700}
                            color={"pink.600"}
                        >
                            {currentCita.servicio
                                ? currentCita.servicio.servicio
                                : "--"}
                        </Text>
                    </HStack>
                </HStack>

                <HStack w={"100%"} justify={"space-between"}>
                    <HStack>
                        <LuBedSingle />
                        <Text>Lashista: </Text>
                    </HStack>
                    <HStack>
                        {currentCita.lashista && (
                            <Text
                                _hover={{
                                    cursor: "pointer",
                                }}
                            >
                                <FaRegSquareMinus
                                    onClick={() => {
                                        handleCurrentCita("Lashista");
                                    }}
                                />
                            </Text>
                        )}
                        <Text
                            textDecor={
                                currentCita.lashista ? "underline" : "none"
                            }
                            fontWeight={700}
                            color={"pink.600"}
                        >
                            {currentCita.lashista
                                ? currentCita.lashista.nombre
                                : "--"}
                        </Text>
                    </HStack>
                </HStack>

                <HStack w={"100%"} justify={"space-between"}>
                    <HStack>
                        <FaRegClock />
                        <Text>Hora: </Text>
                    </HStack>
                    <HStack>
                        {currentCita.horario && (
                            <Text
                                _hover={{
                                    cursor: "pointer",
                                }}
                            >
                                <FaRegSquareMinus
                                    onClick={() => {
                                        handleCurrentCita("Horario");
                                    }}
                                />
                            </Text>
                        )}
                        <Text
                            textDecor={
                                currentCita.horario ? "underline" : "none"
                            }
                            fontWeight={700}
                            color={"pink.600"}
                        >
                            {currentCita.horario
                                ? currentCita.horario.hora
                                : "--"}
                        </Text>
                    </HStack>
                </HStack>

                <HStack w={"100%"} justify={"space-between"}>
                    <HStack>
                        <IoPersonOutline />
                        <Text>Clienta: </Text>
                    </HStack>
                    <HStack>
                        {currentCita.clienta && (
                            <Text
                                _hover={{
                                    cursor: "pointer",
                                }}
                            >
                                <FaRegSquareMinus
                                    onClick={() => {
                                        handleCurrentCita("Clienta");
                                    }}
                                />
                            </Text>
                        )}
                        <Text
                            textDecor={
                                currentCita.clienta ? "underline" : "none"
                            }
                            fontWeight={700}
                            color={"pink.600"}
                        >
                            {currentCita.clienta
                                ? `${currentCita.clienta.nombres} ${currentCita.clienta.apellidos}`
                                : "--"}
                        </Text>
                    </HStack>
                </HStack>

                <HStack w={"100%"} justify={"space-between"}>
                    <HStack>
                        <PiCashRegisterBold />
                        <Text>Total: </Text>
                    </HStack>
                    <Text
                        textDecor={currentCita.servicio ? "underline" : "none"}
                        fontWeight={700}
                        color={"pink.600"}
                    >
                        {currentCita.servicio
                            ? `$${currentCita.servicio.precio}`
                            : "--"}
                    </Text>
                </HStack>
            </VStack>

            {citaID ? (
                <CitaExito />
            ) : (
                <Button
                    onClick={handleAgendar}
                    size={"lg"}
                    bg={"pink.500"}
                    disabled={disabled}
                >
                    Confirmar y Agendar
                </Button>
            )}
        </VStack>
    );
}

function CitaExito() {
    return (
        <VStack gap={"1rem"} align={"center"} w={"100%"}>
            <Alert.Root
                status="success"
                w={"100%"}
                shadow={"md"}
                textAlign={"center"}
            >
                <Alert.Indicator />
                <Alert.Title>¡Cita Agendada Exitosamente!</Alert.Title>
            </Alert.Root>
            <Button colorPalette={"green"}>
                Enviar Ticket
                <BsWhatsapp />
            </Button>
        </VStack>
    );
}

function SelectLashistas({ lashistas }) {
    return (
        <Grid w="100%" gridTemplateColumns={"repeat(2, 1fr)"} gap={"2rem"}>
            {lashistas.map((lashista) => {
                return (
                    <GridItem key={lashista.id}>
                        <LashistaCard data={lashista} />
                    </GridItem>
                );
            })}
        </Grid>
    );
}

function SelectServicios({ servicios }) {
    return (
        <Grid w="100%" gridTemplateColumns={"repeat(2, 1fr)"} gap={"2rem"}>
            {servicios.map((servicio) => {
                return (
                    <GridItem key={servicio.id}>
                        <ServicioCard data={servicio} />
                    </GridItem>
                );
            })}
        </Grid>
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
        };
        console.log(JSON.stringify(send));

        axios.post("/api/citas", send).then((horariosResp) => {
            // const uniqueTimeSlots = getUniqueTimeSlots(
            //     horariosResp.data.horariosDispPorCama
            // );
            // console.log(horariosResp.data);
            // console.log(uniqueTimeSlots);
            setHorarios(horariosResp.data);
        });
    }, []);

    return (
        <HStack justify={"center"} h={"50vh"} align={"center"}>
            {!horarios && (
                <Spinner color="pink.500" borderWidth="4px" size={"lg"} />
            )}

            {horarios && (
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
                                }}
                                bg={"pink.500"}
                                key={hr.hora}
                            >
                                {hr.hora}
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

function SelectClientas({ clientasState, setClientasState, setCurrentPaso }) {
    const [clientas, setClientas] = useState(null);

    useEffect(() => {
        axios.get("/api/clientas").then((clientasResp) => {
            setClientas(clientasResp.data);
        });
    }, []);

    return (
        <Box h={"100%"} w={"100%"} pb={"1rem"}>
            <Grid gridTemplateColumns={"repeat(2, 1fr)"} gap={"2rem"}>
                {/* <Button bg={"pink.500"}>Nueva</Button> */}
                {clientas &&
                    clientasState == "buscar" &&
                    clientas.map((clienta) => {
                        return (
                            <ClientaCard
                                key={clienta.id}
                                data={clienta}
                                setCurrentPaso={setCurrentPaso}
                            />
                        );
                    })}
                {clientas && clientasState == "nueva" && (
                    <NuevaClienta
                        setClientasState={setClientasState}
                        setCurrentPaso={setCurrentPaso}
                    />
                )}
            </Grid>
        </Box>
    );
}

function NuevaClienta({ setClientasState, setCurrentPaso }) {
    const [insertedID, setInsertedID] = useState(null);
    const [currentCita, setCurrentCita] = useCurrentCita();
    const [nuevaClienta, setNuevaClienta] = useState({
        foto_clienta: null,
        nombres: "José Eduardo",
        apellidos: "Meza Canul",
        lada: "52",
        telefono: "9993524438",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNuevaClienta((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAdd = () => {
        console.log(nuevaClienta);
        axios.post("/api/clientas", nuevaClienta).then((nuevaClientaResp) => {
            console.log(nuevaClientaResp.data);
            if (nuevaClientaResp.status == 201 && nuevaClientaResp.data.uuid) {
                setInsertedID(nuevaClientaResp.data.uuid);
                setCurrentCita({
                    ...currentCita,
                    clienta: {
                        ...nuevaClienta,
                        id: nuevaClientaResp.data.uuid,
                    },
                });
            }
        });
    };

    return (
        <>
            <ClientaCard data={nuevaClienta} />
            {insertedID && (
                <VStack gap={"1rem"} align={"start"} w={"100%"}>
                    <Alert.Root status="success" w={"100%"} shadow={"md"}>
                        <Alert.Indicator />
                        <Alert.Title>Clienta Agregada con Exito!</Alert.Title>
                    </Alert.Root>
                    <Button
                        onClick={() => {
                            setCurrentPaso("Confirmar");
                        }}
                        bg={"pink.500"}
                    >
                        Continuar
                    </Button>
                </VStack>
            )}
            {!insertedID && (
                <VStack gap={"1rem"} align={"start"}>
                    <Input
                        bg={"white"}
                        shadow={"md"}
                        name="nombres" // Added name attribute
                        value={nuevaClienta.nombres}
                        onChange={handleChange}
                        placeholder="Nombres"
                    />
                    <Input
                        bg={"white"}
                        shadow={"md"}
                        name="apellidos" // Added name attribute
                        value={nuevaClienta.apellidos}
                        onChange={handleChange}
                        placeholder="Apellidos"
                    />
                    <HStack gap={"1rem"}>
                        <Input
                            bg={"white"}
                            shadow={"md"}
                            name="lada" // Added name attribute
                            w={"25%"}
                            value={nuevaClienta.lada}
                            onChange={handleChange}
                            placeholder="Lada"
                        />
                        <Input
                            bg={"white"}
                            shadow={"md"}
                            name="telefono" // Added name attribute
                            value={nuevaClienta.telefono}
                            onChange={handleChange}
                            placeholder="Telefono/Celular"
                        />
                    </HStack>
                    <HStack gap={"1rem"}>
                        <Button onClick={handleAdd} bg={"pink.500"}>
                            Agregar y Seleccionar
                        </Button>
                        <Button
                            onClick={() => {
                                setClientasState("buscar");
                            }}
                            bg={"gray.500"}
                        >
                            Cancelar
                        </Button>
                    </HStack>
                </VStack>
            )}
        </>
    );
}

function ClientaCard({ data, setCurrentPaso }) {
    const [currentCita, setCurrentCita] = useCurrentCita();

    return (
        <Card.Root
            bg={"white"}
            shadow={"lg"}
            flexDirection="row"
            overflow="hidden"
            maxW="xl"
        >
            <Image
                objectFit="cover"
                w={"8rem"}
                src={
                    data.foto_clienta
                        ? `/img/clientas/${data.foto_clienta}`
                        : "/img/clientas/avatar-woman.png"
                }
                alt=""
            />
            <Box>
                <Card.Body>
                    <Card.Title mb="2">
                        {data.nombres || data.apellidos
                            ? `${data.nombres} ${data.apellidos}`
                            : "--"}
                    </Card.Title>
                    <Card.Description>
                        {data.lada || data.telefono
                            ? `+${data.lada} ${data.telefono}`
                            : "--"}
                    </Card.Description>
                </Card.Body>
                <Card.Footer>
                    {data.id ? (
                        <Button
                            disabled={data.id ? false : true}
                            onClick={() => {
                                setCurrentPaso("Confirmar");
                                setCurrentCita({
                                    ...currentCita,
                                    clienta: data,
                                });
                            }}
                            bg={"pink.500"}
                            size={"sm"}
                        >
                            Seleccionar
                        </Button>
                    ) : (
                        <Badge colorPalette={"green"}>Nueva Clienta</Badge>
                    )}
                </Card.Footer>
            </Box>
        </Card.Root>
    );
}

function formatCurrentDate(date) {
    // const { date } = router.query;
    const [day, month, year] = date.split("-");
    const USDate = new Date(`${month}-${day}-${year}`);
    // console.log(USDate);
    const formattedDate = USDate.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    return formattedDate;
}

function ServicioCard({ data }) {
    const [currentCita, setCurrentCita] = useCurrentCita();
    return (
        <Card.Root overflow="hidden" size="sm" shadow={"md"}>
            <Image
                objectFit="cover"
                // maxW="5rem"
                maxH={"10rem"}
                src={`/img/servicios/${data.image}`}
                alt="Caffe Latte"
            />
            <Box>
                <Card.Body>
                    <Card.Title mb="2">{data.servicio}</Card.Title>
                    <Card.Description>{data.descripcion}</Card.Description>
                </Card.Body>
                <Card.Footer justifyContent={"space-between"}>
                    <HStack mt="4">
                        <Badge colorPalette={"blue"}>
                            {data.minutos} minutos
                        </Badge>
                        <Badge colorPalette={"blue"}>${data.precio}</Badge>
                    </HStack>
                    <Button
                        size={"sm"}
                        bg={"pink.500"}
                        onClick={() => {
                            setCurrentCita({ ...currentCita, servicio: data });
                        }}
                    >
                        Seleccionar
                    </Button>
                </Card.Footer>
            </Box>
        </Card.Root>
    );
}

function LashistaCard({ data }) {
    const [currentCita, setCurrentCita] = useCurrentCita();
    const horariosLV = JSON.parse(data.horarioLV);

    return (
        <Card.Root flexDir={"row"} overflow="hidden" size="sm" shadow={"md"}>
            <Image
                objectFit="cover"
                maxW="12rem"
                // maxH={"10rem"}
                src={`/img/lashistas/${data.image}`}
                alt="Caffe Latte"
            />
            <Box my={"1rem"}>
                <Card.Body>
                    <Card.Title mb="2">{data.nombre}</Card.Title>
                    {/* <Card.Description>{data.horarioLV[0]}</Card.Description> */}
                    <Card.Description>Horario</Card.Description>
                    {horariosLV.map((hlv) => {
                        return <Text key={hlv}>{hlv}</Text>;
                    })}

                    <Card.Description mt={"1rem"}>Sábado</Card.Description>
                    <Text>{data.horarioSBD}</Text>
                </Card.Body>
                <Card.Footer>
                    <Button
                        size={"sm"}
                        bg={"pink.500"}
                        onClick={() => {
                            setCurrentCita({ ...currentCita, lashista: data });
                        }}
                    >
                        Seleccionar
                    </Button>
                </Card.Footer>
            </Box>
        </Card.Root>
    );
}

function getUniqueTimeSlots(data) {
    const allTimes = Object.values(data).flat();
    return [...new Set(allTimes)];
}

// function sortHours(hours) {
//     return hours.sort((a, b) => {
//         const getTimeValue = (time) => {
//             const [h, m] = time.replace(/[+-]/, '').split(':').map(Number);
//             return h * 60 + m;
//         };
//         return getTimeValue(a) - getTimeValue(b);
//     });
// }
