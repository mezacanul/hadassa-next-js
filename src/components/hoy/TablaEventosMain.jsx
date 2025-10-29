import BadgeCustom from "../common/BadgeCustom";
import {
    Box,
    Text,
    HStack,
    Spinner,
    VStack,
} from "@chakra-ui/react";
import "@/config/agGridSetup";
import { AgGridReact } from "ag-grid-react";
import {
    formatFechaDMY,
    formatHorario,
    getFechaLocal,
} from "@/utils/main";

export default function TablaEventosMain({
    eventos,
    primaryColor,
}) {
    const labels = {
        "horas-libres": "Horas Libres",
        "cambio-horario": "Cambio de Horario",
        "dia-libre": "Dia Libre",
    };
    return (
        <Box
            my={"1rem"}
            h={
                eventos && eventos.length > 0
                    ? "30vh"
                    : "initial"
            }
            id={"AG-Table"}
            w={"100%"}
        >
            {!eventos && (
                <HStack
                    w={"100%"}
                    justifyContent={"center"}
                    py={"2rem"}
                >
                    <Spinner
                        color={"pink.500"}
                        size={"md"}
                    />
                </HStack>
            )}
            {eventos && eventos.length > 0 && (
                <AgGridReact
                    rowData={eventos}
                    columnDefs={getColumnDefinitions(
                        primaryColor,
                        labels
                    )}
                    rowHeight={80}
                    // autoSizeStrategy={{
                    //     type: "fitCellContents",
                    // }}
                    defaultColDef={{
                        resizable: true,
                        flex: 2,
                        cellStyle: {
                            display: "flex",
                            alignItems: "center",
                        },
                    }}
                />
            )}
            {eventos && eventos.length == 0 && (
                <Text
                    textAlign={"center"}
                    my={"2rem"}
                >
                    No hay eventos en este día
                </Text>
            )}
        </Box>
    );
}

function getColumnDefinitions(primaryColor, labels) {
    return [
        {
            headerName: "Lashista",
            field: "lashista_nombre",
        },
        {
            headerName: "Titulo",
            field: "titulo",
        },
        {
            headerName: "Tipo",
            field: "tipo",
            valueGetter: (params) =>
                labels[params.data.tipo],
        },
        {
            headerName: "Horas",
            valueGetter: (params) => getHorasByType(params),
            cellStyle: {
                color: primaryColor,
            },
            cellRenderer: HorariosCell,
        },
        {
            headerName: "Fecha",
            // field: "fecha_init",
            valueGetter: (params) =>
                getFechaLocal(params.data.fecha_init),
        },
        {
            headerName: "Notas",
            field: "notas",
        },
    ];
}

function HorariosCell({ value }) {
    console.log("value", typeof value, value);
    return (
        <VStack>
            {typeof value != "string" &&
                value.map((hr) => {
                    return (
                        <Text
                            lineHeight={"1.5"}
                            key={hr}
                            textDecor={"underline"}
                        >
                            {hr}
                        </Text>
                    );
                })}
            {typeof value == "string" && (
                <Text
                    // lineHeight={"1.5"}
                    textDecor={"underline"}
                >
                    {value}
                </Text>
            )}
        </VStack>
    );
}

function getHorasByType(params) {
    const { horarios, hora_init, hora_fin, tipo } =
        params.data;
    if (tipo == "horas-libres") {
        return `${hora_init} - ${hora_fin}`;
    } else if (tipo == "cambio-horario") {
        console.log("horarios", JSON.parse(horarios));
        const formattedHorarios = JSON.parse(horarios).map(
            (hr) => {
                return formatHorario(hr);
            }
        );
        return formattedHorarios;
    } else {
        return "Todo el día";
    }
}
