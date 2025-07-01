import { loadHook } from "@/utils/lattice-design";
import {
    formatEventType,
    getFechaLocal,
} from "@/utils/main";
import {
    Badge,
    Box,
    Button,
    Heading,
    HStack,
    Spinner,
    Table,
    VStack,
} from "@chakra-ui/react";
import { useRouter as useNextNav } from "next/navigation";
import { useEffect, useState } from "react";

export default function TablaEventos({
    eventos,
    setCurrentView,
    setCurrentEvento,
    title,
}) {
    const [loading, setLoading] = useState(null);
    const [, setRootLoading] = loadHook("useLoader");
    const [showAll, setShowAll] = useState(false);
    const NextNav = useNextNav();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <VStack w={"100%"}>
            <HStack
                w={"100%"}
                justifyContent={"space-between"}
            >
                <Heading size={"md"}>{title}</Heading>
                {title == "Por Venir" && (
                    <Button
                        onClick={() => {
                            setCurrentView("nuevo");
                        }}
                        size={"sm"}
                        bg={"pink.500"}
                    >
                        Nuevo
                    </Button>
                )}
            </HStack>

            <Box
                w={"100%"}
                height={
                    !loading && showAll ? "initial" : "30vh"
                }
                // overflowY={showAll ? "initial" : "hidden"}
                position={"relative"}
                mb={showAll ? "6.5rem" : "initial"}
            >
                {/* Spinner  */}
                {loading && !eventos && (
                    <HStack
                        w={"100%"}
                        justifyContent={"center"}
                        py={"2rem"}
                    >
                        <Spinner
                            size={"xl"}
                            borderWidth={"3px"}
                            color={"pink.500"}
                        />
                    </HStack>
                )}

                {/* No hay eventos  */}
                {!eventos && !loading && (
                    <Heading
                        textAlign={"center"}
                        my={"2rem"}
                        size={"xl"}
                    >
                        No hay eventos en este periodo.
                    </Heading>
                )}

                {/* Tabla de Eventos */}
                {!loading && eventos && (
                    <Table.Root
                        size="md"
                        striped
                        variant={"outline"}
                        bg={"white"}
                        w={"100%"}
                    >
                        <Table.Header>
                            <Table.Row bg={"pink.500"}>
                                {tableHeads &&
                                    tableHeads.map((th) => (
                                        <Table.ColumnHeader
                                            key={th}
                                            color={"white"}
                                        >
                                            {th}
                                        </Table.ColumnHeader>
                                    ))}
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {eventos.map((ev, i) => (
                                <EventoRow
                                    key={i}
                                    evento={ev}
                                    setCurrentEvento={
                                        setCurrentEvento
                                    }
                                    setCurrentView={
                                        setCurrentView
                                    }
                                />
                            ))}
                        </Table.Body>
                    </Table.Root>
                )}
            </Box>
        </VStack>
    );
}

function EventoRow({
    evento,
    setCurrentEvento,
    setCurrentView,
}) {
    return (
        <Table.Row
            _hover={{
                color: "pink.600",
                textDecor: "underline",
                cursor: "pointer",
            }}
            transition={"all ease 0.3s"}
            onClick={() => {
                setCurrentEvento(evento);
                setCurrentView("evento");
            }}
        >
            <Table.Cell>{evento.titulo}</Table.Cell>
            <Table.Cell>
                {getFechaLocal(evento.fecha_init)}
            </Table.Cell>
            {/* <Table.Cell>{evento.fecha_fin}</Table.Cell>
            <Table.Cell>{evento.hora_init}</Table.Cell>
            <Table.Cell>{evento.hora_fin}</Table.Cell> */}
            <Table.Cell>
                <Badge
                    shadow={"sm"}
                    fontWeight={700}
                    colorPalette={evento.status == 1 ? "purple" : "red"}
                >
                    {formatEventType(evento.tipo)}
                </Badge>
            </Table.Cell>
        </Table.Row>
    );
}

const tableHeads = [
    "Titulo",
    "Fecha",
    // "Fecha Fin",
    // "Hora Inicio",
    // "Hora Fin",
    "Tipo",
];
