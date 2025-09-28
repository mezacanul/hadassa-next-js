import { useCurrentCita } from "@/pages/nueva-cita/[date]";
import { CDN } from "@/config/cdn";
import {
    Button,
    Box,
    Spinner,
    Image,
} from "@chakra-ui/react";
import { AgGridReact } from "ag-grid-react";
import "@/config/agGridSetup";

export default function TablaClientas({
    setCurrentPaso,
    clientas,
    searchTerm,
    isDuplicate,
}) {
    const flexStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };

    const columnDefs = [
        {
            headerName: "Foto",
            cellRenderer: ({ data }) => (
                <Image
                    src={`${CDN}/img/clientas/${
                        data.foto_clienta ||
                        "avatar-woman.png"
                    }`}
                    w={"3rem"}
                    h={"3rem"}
                    rounded={"full"}
                    objectFit={"cover"}
                />
            ),
            flex: 1,
            cellStyle: flexStyle,
        },
        {
            headerName: "Nombre Completo",
            // field: "nombres",
            valueGetter: (params) =>
                `${params.data.nombres} ${params.data.apellidos}`,
            flex: 3,
            cellStyle: {
                ...flexStyle,
                justifyContent: "start",
                marginLeft: "0.2rem",
            },
        },
        {
            headerName: "Teléfono",
            valueGetter: (params) =>
                `+${params.data.lada} ${params.data.telefono}`,
            flex: 2,
            cellStyle: {
                ...flexStyle,
                justifyContent: "start",
                marginLeft: "0.2rem",
            },
        },
        {
            headerName: "Acciones",
            flex: 3,
            cellRenderer: ({ data }) => (
                <SelectClienta
                    data={data}
                    setCurrentPaso={setCurrentPaso}
                />
            ),
            cellStyle: flexStyle,
        },
    ];

    return (
        <Box
            w={"100%"}
            h={isDuplicate ? "20vh" : "60vh"}
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
