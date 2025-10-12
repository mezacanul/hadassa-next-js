import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Grid,
    Heading,
    HStack,
    Input,
    Spinner,
} from "@chakra-ui/react";
import { loadHook } from "@/utils/lattice-design";
import { AgGridReact } from "ag-grid-react";
import "@/config/agGridSetup";
import axios from "axios";
import { useRouter } from "next/router";
import ModalEliminarClienta from "@/components/clienta/ModalEliminarClienta";

export default function Clientas() {
    const [loading, setLoading] = loadHook("useLoader");
    // const [clientas, setClientas] = useState(null);
    const [clientas, setClientas] = loadHook("useClientas");
    const [searchTerm, setSearchTerm] = useState("");
    const [total, setTotal] = useState(null);
    const [open, setOpen] = useState(false);
    const [clientaToDelete, setClientaToDelete] =
        useState(null);

    useEffect(() => {
        if (!clientas) {
            setLoading(true);
        } else {
            // console.log(clientas);
            setTotal(clientas.length);
            setLoading(false);
        }
    }, [clientas]);

    const columnDefs = [
        {
            headerName: "Nombre Completo",
            // field: "nombres",
            valueGetter: (params) =>
                `${params.data.nombres} ${params.data.apellidos}`,
            flex: 3,
            cellStyle: {
                verticalAlign: "middle",
            },
        },
        {
            headerName: "Teléfono",
            valueGetter: (params) =>
                `+${params.data.lada} ${params.data.telefono}`,
            flex: 2,
            cellStyle: {
                verticalAlign: "middle",
            },
        },
        {
            headerName: "Acciones",
            cellRenderer: ({ data }) => (
                <Actions
                    data={data}
                    setOpen={setOpen}
                    setClientaToDelete={setClientaToDelete}
                />
            ),
            flex: 2,
            cellStyle: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },
        },
    ];

    return (
        <Box
            py={"2rem"}
            w={"80%"}
        >
            <ActionsClienta
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                total={total}
            />
            <Box
                w={"100%"}
                h={"70vh"}
                id={"AG-Table"}
            >
                {!clientas && (
                    <Spinner
                        color="pink.500"
                        borderWidth="4px"
                        size={"xl"}
                    />
                )}
                {clientas && (
                    <AgGridReact
                        rowData={clientas}
                        columnDefs={columnDefs}
                        rowHeight={60}
                        quickFilterText={searchTerm}
                    />
                )}
            </Box>
            <ModalEliminarClienta
                open={open}
                setOpen={setOpen}
                clientaToDelete={clientaToDelete || {}}
                setClientaToDelete={setClientaToDelete}
            />
        </Box>
    );
}

function ActionsClienta({
    searchTerm,
    setSearchTerm,
    total,
}) {
    return (
        <HStack
            w={"100%"}
            justify={"space-between"}
            mb={"1rem"}
            pe={"0.5rem"}
        >
            <Input
                w={"20rem"}
                shadow={"md"}
                bg={"white"}
                size={"sm"}
                placeholder="Buscar"
                value={searchTerm}
                onChange={(e) =>
                    setSearchTerm(e.target.value)
                }
            />
            {total && (
                <Heading size={"md"}>
                    Total: {total}
                </Heading>
            )}
        </HStack>
    );
}

function Actions({ data, setOpen, setClientaToDelete }) {
    const [loading, setLoading] = loadHook("useLoader");
    const router = useRouter();
    return (
        <HStack gap={"1rem"}>
            <Button
                onClick={() => {
                    setLoading(true);
                    router.push(`/clientas/${data.id}`);
                }}
                bg={"pink.500"}
            >
                {"Editar"}
            </Button>
            <Button
                onClick={() => {
                    setOpen(true);
                    setClientaToDelete(data);
                }}
                bg={"gray.500"}
            >
                {"Eliminar"}
            </Button>
        </HStack>
    );
}
