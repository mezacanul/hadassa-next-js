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

export default function Clientas() {
    const [loading, setLoading] = loadHook("useLoader");
    const [clientas, setClientas] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [total, setTotal] = useState(null);

    useEffect(() => {
        setLoading(true);
        axios.get("/api/clientas").then((clientasResp) => {
            console.log(clientasResp.data);
            setClientas(clientasResp.data);
            setTotal(clientasResp.data.length);
            setLoading(false);
        });
    }, []);

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
            cellRenderer: EditButton,
            cellStyle: {
                textAlign: "center",
                marginTop: "0.5rem",
                marginBottom: "0.5rem",
                verticalAlign: "middle",
            },
            flex: 1,
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
                        headerbackgroundColor={"#434343"}
                    />
                )}
            </Box>
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

function EditButton({ data }) {
    const [loading, setLoading] = loadHook("useLoader");
    const router = useRouter();
    return (
        <Button
            onClick={() => {
                setLoading(true);
                router.push(`/clientas/${data.id}`);
            }}
            bg={"pink.500"}
        >
            Editar
        </Button>
    );
}
