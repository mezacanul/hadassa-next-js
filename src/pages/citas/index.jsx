import { formatFechaDMY, formatHoyTitle } from "@/utils/main";
import {
    Badge,
    Box,
    Button,
    Grid,
    Heading,
    HStack,
    Image,
    Table,
    Text,
    VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { TfiReceipt } from "react-icons/tfi";
import { FaWhatsapp } from "react-icons/fa";
import { loadHook } from "@/utils/lattice-design";
import { getCurrentDateSpan } from "@/utils/detalles-citas";

export default function Citas() {
    const [loading, setLoading] = loadHook("useLoader");
    const [lashistas, setLashistas] = useState(null);
    const [currentLashista, setCurrentLashista] = useState(null);
    // const [citas, setCitas] = useState(null);

    useEffect(() => {
        setLoading(false);
        // console.log("date", new Date());

        axios
            .get("/api/detalles-citas?action=lashistas")
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
        <Grid w={"100%"} gap={"4rem"} gridTemplateColumns={"2fr 3fr"}>
            <Lashistas lashistas={lashistas} />
            <AgendaLashista current={currentLashista} />
        </Grid>
    );
}

function Lashistas({ lashistas }) {
    return (
        <VStack align={"start"} gap={"2rem"}>
            <Heading size={"2xl"}>Seleccionar Lashista:</Heading>
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
    return (
        <HStack
            shadow={"sm"}
            bg={"white"}
            w={"100%"}
            px={"2rem"}
            py={"1rem"}
            gap={"2rem"}
            transition={"all ease 0.3s"}
            _hover={{
                transform: "scale(1.05)",
                cursor: "pointer",
                shadow: "md",
            }}
        >
            <Image
                src={`/img/lashistas/${data.foto}`}
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
                    {/* <Text>10</Text> */}
                </HStack>

                <HStack w={"100%"} justifyContent={"space-between"}>
                    <HStack>
                        <TfiReceipt size={"1.2rem"} />
                        <Text>Futuras:</Text>
                    </HStack>
                    {/* <Text>5</Text> */}
                </HStack>
            </VStack>
        </HStack>
    );
}

function AgendaLashista({ current }) {
    const [dateInfo, setDateInfo] = useState(getCurrentDateSpan());

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
            />
            <CitasInfo
                title={"Futuras"}
                dateInfo={`${dateInfo?.future} en adelante`}
                lashista={current}
            />
            <CitasInfo
                title={"Pasadas"}
                dateInfo={`${dateInfo?.past} hacias atrás`}
                lashista={current}
            />
        </VStack>
    );
}

function CitasInfo({ title, dateInfo, lashista }) {
    // const [citas, setCitas] = useState();

    useEffect(() => {
        console.log(lashista);
        
        // if(current){
        //     axios.get()
        // }
    }, [lashista]);
    return (
        <VStack gap={"1rem"} w={"100%"}>
            <HStack justify={"space-between"} w={"100%"}>
                <Text>{title}</Text>
                <Text>{dateInfo}</Text>
            </HStack>
            {citas ? (
                <CitasTable citas={citas} />
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

function CitasTable({ citas }) {
    return (
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
                    <Table.ColumnHeader color={"white"}></Table.ColumnHeader>
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
                    <Table.Row key={i}>
                        <Table.Cell>
                            <TfiReceipt size={"1.7rem"} />
                        </Table.Cell>
                        <Table.Cell>{`${cita.nombres} ${cita.apellidos}`}</Table.Cell>
                        <Table.Cell>{cita.servicio}</Table.Cell>
                        <Table.Cell>{cita.fecha}</Table.Cell>
                        <Table.Cell>{cita.hora}</Table.Cell>
                        <Table.Cell>
                            {cita.confirmada ? (
                                <Badge colorPalette={"green"}>Confirmada</Badge>
                            ) : (
                                <Badge colorPalette={"yellow"}>Pendiente</Badge>
                            )}
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
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
