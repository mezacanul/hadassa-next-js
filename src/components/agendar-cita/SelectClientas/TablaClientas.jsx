import { useCurrentCita } from "@/pages/nueva-cita/[date]";
import { Button, Box, Spinner } from "@chakra-ui/react";
import { AgGridReact } from "ag-grid-react";
import "@/config/agGridSetup";

export default function TablaClientas({
    setCurrentPaso,
    clientas,
    searchTerm,
}) {
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
                <SelectClienta
                    data={data}
                    setCurrentPaso={setCurrentPaso}
                />
            ),
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
            w={"100%"}
            h={"60vh"}
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
                    // headerbackgroundColor={"#434343"}
                    quickFilterText={searchTerm}
                />
            )}
        </Box>
    );
}

function SelectClienta({ data, setCurrentPaso }) {
    const [currentCita, setCurrentCita] = useCurrentCita();

    const handleSelect = () => {
        setCurrentPaso("Confirmar");
        setCurrentCita({
            ...currentCita,
            clienta: data,
        });
    };

    return (
        <Button
            onClick={handleSelect}
            bg={"pink.500"}
            size={"sm"}
        >
            {"Seleccionar"}
        </Button>
    );
}
