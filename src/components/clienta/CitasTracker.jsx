import {
    formatFechaDMY,
    formatHoyTitle,
} from "@/utils/main";
import {
    Badge,
    Box,
    Grid,
    GridItem,
    Heading,
    HStack,
    Table,
    VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { TfiReceipt } from "react-icons/tfi";
import { FaStar } from "react-icons/fa";
import { loadHook } from "@/utils/lattice-design";
import { useRouter as useNextNav } from "next/navigation";

export default function CitasTracker({ citas }) {
    const [citasPagadas, setCitasPagadas] = useState(null);

    useEffect(() => {
        const detalle = {};

        citas.forEach((cita) => {
            if (cita.pagado == 1 && cita.status != 0) {
                if (detalle[cita.servicio]) {
                    detalle[cita.servicio] += 1;
                } else {
                    detalle[cita.servicio] = 1;
                }
            }
        });

        setCitasPagadas(detalle);
    }, []);

    return (
        <VStack
            w={"100%"}
            alignItems={"start"}
            gap={"2rem"}
        >
            <Heading size={"2xl"}>
                Historial de Citas
            </Heading>

            {citasPagadas && (
                <CitasPagadas data={citasPagadas} />
            )}

            <TablaCitas>
                {citas.map((cita, idx) => (
                    <CitaRow
                        key={idx}
                        cita={cita}
                    />
                ))}
            </TablaCitas>
        </VStack>
    );
}

function CitasPagadas({ data }) {
    function tieneDescuento(num) {
        const newTotal = num + 1;
        if (newTotal % 6 == 0) {
            return true;
        } else {
            return false;
        }
    }

    return (
        <Box
            bg={"white"}
            borderWidth={"2px"}
            borderColor={"pink.600"}
            rounded={"md"}
            w={"70%"}
            shadow={"sm"}
            p={"1rem"}
        >
            <HStack
                mb={"1rem"}
                w={"100%"}
                justifyContent={"space-between"}
            >
                <HStack>
                    <Heading>
                        <TfiReceipt />
                    </Heading>
                    <Heading color={"pink.500"}>
                        {"Citas Pagadas"}
                    </Heading>
                </HStack>

                <Heading>{getTotal(data)}</Heading>
            </HStack>
            <VStack
                alignItems={"start"}
                gap={"1rem"}
                w={"100%"}
            >
                {Object.keys(data).map((servicio) => (
                    <HStack
                        w={"100%"}
                        justifyContent={"space-between"}
                    >
                        <Heading
                            size={"md"}
                        >{`${servicio}:`}</Heading>

                        <Badge
                            colorPalette={
                                tieneDescuento(
                                    data[servicio]
                                )
                                    ? "purple"
                                    : "blue"
                            }
                            fontWeight={700}
                            px={"0.5rem"}
                            shadow={"sm"}
                        >
                            {`${data[servicio]} Cita`}
                            {data[servicio] > 1 ? "s" : ""}
                            {tieneDescuento(
                                data[servicio]
                            ) ? (
                                <FaStar />
                            ) : (
                                ""
                            )}
                        </Badge>
                    </HStack>
                ))}
            </VStack>
        </Box>
    );
}

function TablaCitas({ children, w = "100%" }) {
    return (
        <Table.Root
            size="md"
            striped
            variant={"outline"}
            bg={"white"}
            w={w}
        >
            <Table.Header>
                <Table.Row bg={"pink.500"}>
                    <Table.ColumnHeader
                        color={"white"}
                    ></Table.ColumnHeader>
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
                    <Table.ColumnHeader color={"white"}>
                        Pagada
                    </Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>{children}</Table.Body>
        </Table.Root>
    );
}

function CitaRow({ cita }) {
    const [, setLoading] = loadHook("useLoader");
    const NextNav = useNextNav();

    return (
        <Table.Row
            _hover={{
                color: "pink.600",
                textDecor: "underline",
                cursor: "pointer",
            }}
            onClick={() => {
                setLoading(true);
                NextNav.push(`/citas/${cita.id}`);
            }}
            transition={"all ease 0.3s"}
        >
            <Table.Cell>
                <TfiReceipt size={"1.7rem"} />
            </Table.Cell>
            <Table.Cell>{cita.servicio}</Table.Cell>
            <Table.Cell>
                {formatHoyTitle(formatFechaDMY(cita.fecha))}
            </Table.Cell>
            <Table.Cell>{cita.hora}</Table.Cell>
            <Table.Cell>
                <Badge
                    shadow={"sm"}
                    fontWeight={600}
                    colorPalette={
                        cita.status === 0
                            ? "red"
                            : cita.status === 1
                            ? "yellow"
                            : cita.status === 2
                            ? "green"
                            : ""
                    }
                >
                    {cita.status === 0
                        ? "Cancelada"
                        : cita.status === 1
                        ? "Pendiente"
                        : cita.status === 2
                        ? "Confirmada"
                        : ""}
                </Badge>
            </Table.Cell>
            <Table.Cell>
                <Badge
                    shadow={"sm"}
                    fontWeight={600}
                    colorPalette={
                        cita.pagado == 1 ? "green" : "gray"
                    }
                >
                    {cita.pagado == 1
                        ? "Pagada"
                        : "Pendiente"}
                </Badge>
            </Table.Cell>
        </Table.Row>
    );
}

function getTotal(indexedCitas){
    let total = 0
    Object.keys(indexedCitas).forEach((servicio)=>{
        total = total + indexedCitas[servicio]
    })
    return total 
}