import { formatFechaDMY, formatHoyTitle } from "@/utils/main";
import {
    Badge,
    Box,
    Button,
    Grid,
    Heading,
    HStack,
    Image,
    Spinner,
    Table,
    Text,
    VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { TfiReceipt } from "react-icons/tfi";
import { FaWhatsapp } from "react-icons/fa";
import { loadHook, Singleton } from "@/utils/lattice-design";
import { getCurrentDateSpan } from "@/utils/detalles-citas";
import { useRouter as useNextNav } from "next/navigation";
import { TbCircleDashedPlus } from "react-icons/tb";
import { CDN } from "@/config/cdn";

const useCurrentLashista = Singleton(null);
const useDateInfo = Singleton(getCurrentDateSpan());

export default function Citas() {
    const [loading, setLoading] = loadHook("useLoader");
    const [lashistas, setLashistas] = useState(null);
    const [currentLashista, setCurrentLashista] = useCurrentLashista();
    // const [citas, setCitas] = useState(null);

    useEffect(() => {
        setLoading(false);
        // console.log("date", new Date());

        axios
            .get("/api/detalles-citas?table=lashistas")
            .then((lashistasResp) => {
                console.log(lashistasResp.data);
                setLashistas(lashistasResp.data);
                setCurrentLashista(lashistasResp.data[0]);
            });
    }, []);

    return (
        // <Box w={"100%"}>
        //     {citas && <CitasTable citas={citas} />}
        // </Box>
        <Grid
            pb={"5rem"}
            w={"100%"}
            gap={"4rem"}
            gridTemplateColumns={"2fr 3fr"}
        >
            <Lashistas lashistas={lashistas} />
            <AgendaLashista current={currentLashista} />
        </Grid>
    );
}

function Lashistas({ lashistas }) {
    return (
        <VStack align={"start"} gap={"2rem"}>
            <Heading size={"2xl"}>Seleccionar Lashista:</Heading>
            {!lashistas && (
                <Spinner size={"xl"} borderWidth={"3px"} color={"pink.500"} />
            )}
            <VStack w={"100%"} gap={"2rem"}>
                {lashistas &&
                    lashistas.map((lashista, idx) => {
                        return <LashistaCard key={idx} data={lashista} />;
                    }, [])}
            </VStack>
        </VStack>
    );
}

function LashistaCard({ data }) {
    const [currentLashista, setCurrentLashista] = useCurrentLashista();
    const [dateInfo, setDateInfo] = useDateInfo();
    const [citasCount, setCitasCount] = useState(null);

    useEffect(() => {
        // console.log(dateInfo);
        // console.log(currentLashista);
        axios
            .get(
                `/api/detalles-citas?table=citas&length=short&lashista=${data.id}`
            )
            .then((citaDetResp) => {
                setCitasCount({
                    thisWeek: citaDetResp.data.counts.thisWeek,
                    future: citaDetResp.data.counts.future,
                });
            });
    }, []);

    return (
        <HStack
            shadow={"md"}
            bg={"white"}
            w={"100%"}
            px={"2rem"}
            py={"1rem"}
            gap={"2rem"}
            transition={"all ease 0.3s"}
            _hover={{
                transform: "scale(1.05)",
                cursor: "pointer",
                shadow: "lg",
            }}
            borderWidth={currentLashista?.id == data.id ? "3px" : ""}
            borderColor={"pink.500"}
            rounded={"md"}
            onClick={() => {
                setCurrentLashista(data);
            }}
        >
            <Image
                src={`${CDN}/img/lashistas/${data.foto}`}
                w={"7rem"}
                rounded={"full"}
            />
            <VStack align={"start"} w={"100%"}>
                <Heading color={"pink.600"}>{data.nombre}</Heading>
                <HStack w={"100%"} justifyContent={"space-between"}>
                    <HStack>
                        <TfiReceipt size={"1.2rem"} />
                        <Text>Esta Semana:</Text>
                    </HStack>
                    {citasCount && (
                        <Text fontWeight={600} color={"blue.600"}>
                            {citasCount.thisWeek}
                        </Text>
                    )}
                </HStack>

                <HStack w={"100%"} justifyContent={"space-between"}>
                    <HStack>
                        <TfiReceipt size={"1.2rem"} />
                        <Text>Futuras:</Text>
                    </HStack>
                    {citasCount && (
                        <Text fontWeight={600} color={"blue.600"}>
                            {citasCount.future}
                        </Text>
                    )}
                </HStack>
            </VStack>
        </HStack>
    );
}

function AgendaLashista({ current }) {
    const [dateInfo, setDateInfo] = useDateInfo();
    const [currentLashista, setCurrentLashista] = useCurrentLashista();
    const [thisWeek, setThisWeek] = useState(null);
    const [future, setFuture] = useState(null);
    const [past, setPast] = useState(null);

    useEffect(() => {
        console.log("dateinfo", dateInfo);
    }, []);

    useEffect(() => {
        setThisWeek(null);
        setFuture(null);
        setPast(null);
        if (current) {
            Promise.all([
                axios.get(
                    `/api/detalles-citas?table=citas&length=full&period=thisWeek&lashista=${current.id}`
                ),
                axios.get(
                    `/api/detalles-citas?table=citas&length=full&period=future&lashista=${current.id}`
                ),
                axios.get(
                    `/api/detalles-citas?table=citas&length=full&period=past&lashista=${current.id}`
                ),
            ]).then(([thisWeekResp, futureResp, pastResp]) => {
                console.log(thisWeekResp.data.citas);

                setThisWeek(thisWeekResp.data.citas);
                setFuture(futureResp.data.citas);
                setPast(pastResp.data.citas);
            });
            console.log(current);
        }
    }, [current]);

    return (
        <VStack gap={"2rem"} align={"end"}>
            <HStack justify={"space-between"} w={"100%"}>
                <Heading size={"2xl"}>{current?.nombre}</Heading>
                {/* <Button colorPalette={"green"}>
                    <FaWhatsapp /> Enviar Recordatorios de Esta Semana
                </Button> */}
            </HStack>
            <CitasInfo
                title={"Esta Semana"}
                dateInfo={`${dateInfo?.thisWeek.startDate} - ${dateInfo?.thisWeek.endDate}`}
                lashista={current}
                data={thisWeek}
            />
            <CitasInfo
                title={"Futuras"}
                dateInfo={`${dateInfo?.future} en adelante`}
                lashista={current}
                data={future}
            />
            <CitasInfo
                title={"Pasadas"}
                dateInfo={`${dateInfo?.past} hacias atrás`}
                lashista={current}
                data={past}
            />
        </VStack>
    );
}

function CitasInfo({ title, dateInfo, lashista, data }) {
    // const [citas, setCitas] = useState();

    useEffect(() => {
        console.log(lashista);
        console.log("data", data);
        // setCitas(data)
        // if(current){
        //     axios.get()
        // }
    }, [lashista]);

    return (
        <VStack gap={"1rem"} w={"100%"}>
            <HStack justify={"space-between"} w={"100%"}>
                <Text>
                    {title}: {data && data.length}
                </Text>
                <Text color={"pink.600"} fontWeight={"700"}>
                    {dateInfo}
                </Text>
            </HStack>
            {citas ? (
                <CitasTable citas={data} lashista={lashista} />
            ) : (
                <Heading mb={"2rem"}>Sin citas en este periodo</Heading>
            )}
            {/* <Box bg={"gray"} w={"20rem"} h={"10rem"}/> */}
        </VStack>
    );
}

function LashistaAvatar({ nombre, foto }) {
    return (
        <VStack>
            <Image
                src={`/img/lashistas/${foto}`}
                w={"10rem"}
                rounded={"full"}
            />
            <Text>{nombre}</Text>
        </VStack>
    );
}

function CitasTable({ citas, lashista }) {
    const [loading, setLoading] = useState(null);
    const [, setRootLoading] = loadHook("useLoader");
    const [showAll, setShowAll] = useState(false);
    const NextNav = useNextNav();

    useEffect(() => {
        if (citas) {
            setLoading(false);
        }
    }, [citas]);

    useEffect(() => {
        setLoading(true);
        setShowAll(false);
    }, [lashista]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <Box
            w={"100%"}
            height={!loading && showAll ? "initial" : "50vh"}
            overflowY={showAll ? "initial" : "hidden"}
            position={"relative"}
            mb={showAll ? "6.5rem" : "initial"}
        >
            {!loading && !showAll && (
                <Box
                    bottom={0}
                    position={"absolute"}
                    w={"100%"}
                    h={"10rem"}
                    bg={`linear-gradient(to top, #f1f5ff 70%, transparent 100%)`}
                />
            )}
            {!loading && (
                <HStack
                    w={"100%"}
                    pos={"absolute"}
                    bottom={0}
                    justifyContent={"center"}
                    zIndex={10}
                >
                    <Heading
                        onClick={() => {
                            if (showAll) {
                                scrollToTop();
                            }
                            setShowAll(!showAll);
                        }}
                        mb={showAll ? "-6.5rem" : "3rem"}
                        _hover={{ cursor: "pointer" }}
                        textDecor={"underline"}
                        size={"md"}
                    >
                        {!showAll && "Mostrar todos"}
                        {showAll && "Mostrar menos"}
                    </Heading>
                </HStack>
            )}
            {loading && !citas && (
                <HStack w={"100%"} justifyContent={"center"} py={"2rem"}>
                    <Spinner
                        size={"xl"}
                        borderWidth={"3px"}
                        color={"pink.500"}
                    />
                </HStack>
            )}

            {!citas && !loading && (
                <Heading textAlign={"center"} my={"2rem"} size={"xl"}>
                    No hay citas en este periodo.
                </Heading>
            )}

            {!loading && citas && (
                <Table.Root
                    size="md"
                    striped
                    variant={"outline"}
                    bg={"white"}
                    w={"100%"}
                    // m={"auto"}
                >
                    <Table.Header>
                        <Table.Row bg={"pink.500"}>
                            <Table.ColumnHeader
                                color={"white"}
                            ></Table.ColumnHeader>
                            <Table.ColumnHeader color={"white"}>
                                Nombre
                            </Table.ColumnHeader>
                            <Table.ColumnHeader color={"white"}>
                                Servicio
                            </Table.ColumnHeader>
                            <Table.ColumnHeader color={"white"}>
                                Fecha
                            </Table.ColumnHeader>
                            <Table.ColumnHeader color={"white"}>
                                Hora
                            </Table.ColumnHeader>
                            <Table.ColumnHeader color={"white"}>
                                Estado
                            </Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {citas.map((cita, i) => (
                            <Table.Row
                                key={i}
                                _hover={{
                                    color: "pink.600",
                                    textDecor: "underline",
                                    cursor: "pointer",
                                }}
                                onClick={() => {
                                    setRootLoading(true);
                                    NextNav.push(`/citas/${cita.id}`);
                                }}
                                transition={"all ease 0.3s"}
                            >
                                <Table.Cell>
                                    <TfiReceipt size={"1.7rem"} />
                                </Table.Cell>
                                <Table.Cell>
                                    {`${cita.clienta_nombres} ${cita.clienta_apellidos}`}
                                </Table.Cell>
                                <Table.Cell>{cita.servicio}</Table.Cell>
                                <Table.Cell>
                                    {formatHoyTitle(formatFechaDMY(cita.fecha))}
                                </Table.Cell>
                                <Table.Cell>{cita.hora}</Table.Cell>
                                <Table.Cell>
                                    {cita.status == 0 && (
                                        <Badge colorPalette={"red"}>
                                            Cancelada
                                        </Badge>
                                    )}
                                    {cita.status == 1 && (
                                        <Badge colorPalette={"yellow"}>
                                            Pendiente
                                        </Badge>
                                    )}
                                    {cita.status == 2 && (
                                        <Badge colorPalette={"green"}>
                                            Confirmada
                                        </Badge>
                                    )}
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            )}
        </Box>
    );
}

const citas = [
    {
        nombres: "Jose Eduardo",
        apellidos: "Meza Canul",
        servicio: "Lash Lift",
        fecha: "01/05/2025",
        hora: "10:00",
        confirmada: true,
    },
    {
        nombres: "Jose Eduardo",
        apellidos: "Meza Canul",
        servicio: "Lash Lift",
        fecha: "01/05/2025",
        hora: "10:00",
        confirmada: true,
    },
    {
        nombres: "Jose Eduardo",
        apellidos: "Meza Canul",
        servicio: "Lash Lift",
        fecha: "01/05/2025",
        hora: "10:00",
        confirmada: false,
    },
];
