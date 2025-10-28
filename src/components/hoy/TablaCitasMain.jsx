import {
    Box,
    Text,
    HStack,
    Spinner,
    Button,
    Badge,
    VStack,
} from "@chakra-ui/react";
import "@/config/agGridSetup";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useState } from "react";
import StatusBadge from "../common/StatusBadge";
import ModalAccionesCita from "./ModalAccionesCita";
import CostoSelector from "../common/CostoSelector";
import { addMinutesToTime } from "@/utils/main";

export default function TablaCitasMain({
    citas,
    primaryColor,
    goToServicio,
    servicios,
}) {
    const [open, setOpen] = useState(false);
    const [cita, setCita] = useState(null);

    return (
        <Box
            my={"1rem"}
            h={
                citas && citas.length > 0
                    ? "50vh"
                    : "initial"
            }
            id={"AG-Table"}
            w={"100%"}
        >
            {!citas && (
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
            {citas && citas.length > 0 && (
                <AgGridReact
                    rowData={citas}
                    columnDefs={getColumnDefinitions(
                        primaryColor,
                        goToServicio,
                        setOpen,
                        setCita,
                        servicios
                    )}
                    rowHeight={60}
                    autoSizeStrategy={{
                        type: "fitCellContents",
                    }}
                    defaultColDef={{
                        resizable: true,
                        // flex: 2,
                        cellStyle: {
                            display: "flex",
                            // justifyContent: "center",
                            alignItems: "center",
                        },
                    }}
                    // quickFilterText={searchTerm}
                />
            )}
            {citas && citas.length == 0 && (
                <Text
                    textAlign={"center"}
                    my={"2rem"}
                >
                    No hay citas en este día
                </Text>
            )}

            <ModalAccionesCita
                open={open}
                setOpen={setOpen}
                cita={cita}
                servicios={servicios}
            />
        </Box>
    );
}

function getColumnDefinitions(
    primaryColor,
    goToServicio,
    setOpen,
    setCita,
    servicios
) {
    return [
        {
            headerName: "Horario",
            field: "hora",
            pinned: "left",
            cellRenderer: HorarioCell,
        },
        // {
        //     headerName: "Salida",
        //     // field: "hora",
        //     valueGetter: ({ data }) =>
        //         addMinutesToTime(data.hora, data.minutos),
        //     cellStyle: {
        //         justifyContent: "center",
        //     },
        //     pinned: "left",
        // },
        {
            headerName: "Nombre",
            valueGetter: (params) =>
                `${params.data.nombres} ${params.data.apellidos}`,
            cellClass: "hover-link",
            onCellClicked: (params) => {
                goToServicio(params.data.cita_ID);
            },
            // flex: 3,
            pinned: "left",
        },
        {
            headerName: "Servicio",
            field: "servicio",
            // flex: 3,
            cellClass: "hover-link",
            onCellClicked: (params) => {
                goToServicio(params.data.cita_ID);
            },
            pinned: "left",
        },
        {
            headerName: "Lashista",
            field: "lashista",
            // flex: 2,
            // minWidth: 100,
        },
        {
            headerName: "Status",
            // field: "status",
            width: 150,
            cellStyle: {
                justifyContent: "center",
            },
            cellRenderer: ({ data }) => (
                <StatusBadge
                    status={data.status}
                    pagado={data.pagado}
                />
            ),
        },
        {
            headerName: "Costo",
            field: "monto_pagado",
            cellRenderer: ({ data, value }) => (
                <CostoSelector
                    data={data}
                    value={value}
                    servicios={servicios}
                />
            ),
            // valueGetter: (params) => "--",

            cellStyle: {
                justifyContent: "center",
            },
        },
        {
            headerName: "Acciones",
            cellRenderer: ({ data }) => (
                <Actions
                    data={data}
                    setOpen={setOpen}
                    setCita={setCita}
                />
            ),
            width: 150,
            // flex: 3,
            // cellStyle: {
            //     width: "15rem",
            // },
        },
    ];
}

function Actions({ data, setOpen, setCita }) {
    const buttonStyles = {
        variant: "surface",
        // colorPalette: "blue",
        size: "sm",
        // shadow: "sm",
        fontWeight: "600",
    };
    return (
        <HStack w={"15rem"}>
            <Button
                {...buttonStyles}
                colorPalette={"blue"}
                onClick={() => {
                    setOpen(true);
                    setCita(data);
                }}
            >
                {"Opciones"}
            </Button>
        </HStack>
    );
}

function HorarioCell({ data }) {
    return (
        <HStack
            justifyContent="center"
            gap={1.5}
        >
            <Text
                fontWeight="bold"
                color={"blue.600"}
            >
                {data.hora}
            </Text>
            <Text
                fontSize={"0.8rem"}
            >{` a ${addMinutesToTime(
                data.hora,
                data.minutos
            )}`}</Text>
        </HStack>
    );
}
