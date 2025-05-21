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
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { loadHook, Singleton } from "@/utils/lattice-design";
import { formatFechaDMY, formatHoyTitle } from "@/utils/main";
import axios from "axios";
import { parse, format } from "date-fns";
import { es } from "date-fns/locale";

import { LuBedSingle, LuReceiptText, LuCalendar1 } from "react-icons/lu";
import { FaRegClock } from "react-icons/fa";
import { IoPersonOutline } from "react-icons/io5";
import { PiCashRegisterBold } from "react-icons/pi";
import { FaRegSquareMinus } from "react-icons/fa6";

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
    const [horarios, setHorarios] = useState(null);
    const [clientas, setClientas] = useState(null);

    const [currentPaso, setCurrentPaso] = useState("Servicio");

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
    }, [currentCita]);

    useEffect(() => {
        if (router.isReady) {
            setCurrentCita({ ...currentCita, fecha: formatCurrentDate(date) });
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
                mt={"1rem"}
                textAlign={"center"}
                fontWeight={300}
                size={"4xl"}
                mb={"2rem"}
            >
                Agendar Cita
            </Heading>

            <HStack
                w={"100%"}
                justify={"space-between"}
                gap={"2rem"}
                align={"start"}
            >
                <VStack style={{ width: "65%" }} align={"start"}>
                    <Heading mb={"1rem"}>Seleccionar {currentPaso}:</Heading>

                    <Box w={"100%"} maxH={"60vh"} overflowY={"scroll"}>
                        {servicios && !currentCita.servicio && (
                            <SelectServicios servicios={servicios} />
                        )}
                        {lashistas && !currentCita.lashista && (
                            <SelectLashistas lashistas={lashistas} />
                        )}
                        {currentCita.servicio && currentCita.lashista && (
                            <SelectHorarios
                                currentCita={currentCita}
                                selectedDate={selectedDate}
                            />
                        )}
                    </Box>
                    {/* <Heading>Seleccionar Lashista</Heading>
                    <Heading>Seleccionar Horario</Heading>
                    <Heading>Seleccionar Clienta</Heading> */}
                </VStack>

                <OrderSummary />
            </HStack>
        </Box>
    );
}

function OrderSummary() {
    const [selectedDate, setSelectedDate] = loadHook("useSelectedDate");
    const [currentCita, setCurrentCita] = useCurrentCita();

    return (
        <VStack style={{ width: "35%" }}>
            <Heading>Resumen</Heading>

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
                    <Text fontWeight={700}>
                        {selectedDate && formatFechaDMY(selectedDate)}
                    </Text>
                </HStack>

                <HStack w={"100%"} justify={"space-between"}>
                    <HStack>
                        <LuReceiptText />
                        <Text>Servicio: </Text>
                    </HStack>
                    <HStack>
                        {currentCita.servicio && <FaRegSquareMinus />}
                        <Text fontWeight={700}>
                            {currentCita.servicio
                                ? currentCita.servicio.servicio
                                : "--"}
                        </Text>
                    </HStack>
                </HStack>

                <HStack w={"100%"} justify={"space-between"}>
                    <HStack>
                        <PiCashRegisterBold />
                        <Text>Precio: </Text>
                    </HStack>
                    <Text fontWeight={700}>
                        {currentCita.servicio
                            ? `$${currentCita.servicio.precio}`
                            : "--"}
                    </Text>
                </HStack>

                <HStack w={"100%"} justify={"space-between"}>
                    <HStack>
                        <LuBedSingle />
                        <Text>Lashista: </Text>
                    </HStack>
                    <HStack>
                        {currentCita.lashista && <FaRegSquareMinus />}
                        <Text fontWeight={700}>
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
                    <Text fontWeight={700}>--</Text>
                </HStack>

                <HStack w={"100%"} justify={"space-between"}>
                    <HStack>
                        <IoPersonOutline />
                        <Text>Clienta: </Text>
                    </HStack>
                    <Text fontWeight={700}>--</Text>
                </HStack>
            </VStack>

            <Button bg={"pink.500"}>Confirmar Detalles</Button>
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

function SelectHorarios({ currentCita, selectedDate }) {
    const [horarios, setHorarios] = useState(null);

    useEffect(() => {
        const send = {
            fecha: formatFechaDMY(selectedDate),
            servicio_id: currentCita.servicio.id,
            lashista_id: currentCita.lashista.id,
        };
        console.log(JSON.stringify(send));

        axios.post("/api/citas", send).then((horariosResp) => {
            const uniqueTimeSlots = getUniqueTimeSlots(
                horariosResp.data.horariosDispPorCama
            );
            console.log(horariosResp.data);
            console.log(uniqueTimeSlots);
            setHorarios(sortHours(uniqueTimeSlots));
        });
    }, []);

    return (
        <Box>
            {!horarios && (
                <Spinner color="blue.500" borderWidth="4px" size={"lg"} />
            )}
            
            {horarios && (
                <Grid gridTemplateColumns={"repeat(4, 1fr)"} gap={"1.5rem"}>
                    {horarios.map((hr) => {
                        return <Badge key={hr}>{hr}</Badge>;
                    })}
                </Grid>
            )}
        </Box>
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
        <Card.Root overflow="hidden" size="sm">
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
                        <Badge colorPalette={"cyan"}>
                            {data.minutos} minutos
                        </Badge>
                        <Badge colorPalette={"cyan"}>${data.precio}</Badge>
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
        <Card.Root flexDir={"row"} overflow="hidden" size="sm">
            <Image
                objectFit="cover"
                maxW="7rem"
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

function sortHours(hours) {
    return hours.sort((a, b) => {
        const getTimeValue = (time) => {
            const [h, m] = time.replace(/[+-]/, '').split(':').map(Number);
            return h * 60 + m;
        };
        return getTimeValue(a) - getTimeValue(b);
    });
}