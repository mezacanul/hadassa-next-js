import {
    Box,
    Text,
    HStack,
    Spinner,
    Button,
    Badge,
    VStack,
    Switch,
} from "@chakra-ui/react";
import "@/config/agGridSetup";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useState } from "react";
import StatusBadge from "../common/StatusBadge";
import ModalAccionesCita from "./ModalAccionesCita";
import CostoSelector from "../common/CostoSelector";
import { addMinutesToTime } from "@/utils/main";
import { useToken } from "@chakra-ui/react";
import API from "@/services/main";

export default function TablaCitasMain({
    citas,
    setCitas,
    primaryColor,
    goToServicio,
    servicios,
}) {
    const [open, setOpen] = useState(false);
    const [cita, setCita] = useState(null);
    const colors = {
        green: useToken("colors", "green.200"),
        pink: useToken("colors", "pink.200"),
        yellow: useToken("colors", "yellow.50"),
        gray: useToken("colors", "gray.300"),
    };

    const updateEnServicio = async (
        cita_ID,
        enServicio
    ) => {
        console.log(cita_ID, enServicio);
        const resp = await API.citas.actualizarEnServicio(
            cita_ID,
            enServicio
        );
        if (
            resp.data.success &&
            resp.data.affectedRows == 1
        ) {
            console.log("resp", resp);
            const updatedObject = citas.find(
                (cita) => cita.cita_ID === cita_ID
            );
            updatedObject.en_servicio = enServicio;
            const updatedArray = citas.map((cita) =>
                cita.cita_ID === cita_ID
                    ? updatedObject
                    : cita
            );
            setCitas(updatedArray);
            return true;
        } else {
            console.log("error", resp);
            return false;
        }

        // .then((resp) => {
        // console.log(resp);
        // });
    };

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
            <style>{getStylesRowStatus(colors)}</style>
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
                    getRowId={({ data }) => data.cita_ID}
                    columnDefs={getColumnDefinitions(
                        primaryColor,
                        goToServicio,
                        setOpen,
                        setCita,
                        servicios,
                        updateEnServicio
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
                    rowClassRules={{
                        "cita-pendiente": ({ data }) =>
                            data.en_servicio != 1 &&
                            data.pagado != 1 &&
                            data.status == 1,
                        "cita-confirmada": ({ data }) =>
                            data.en_servicio != 1 &&
                            data.pagado != 1 &&
                            data.status == 2,
                        "cita-pagada": ({ data }) =>
                            data.en_servicio != 1 &&
                            data.pagado == 1,
                        "cita-en-servicio": ({ data }) =>
                            data.en_servicio == 1,
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
                setCita={setCita}
                servicios={servicios}
                citas={citas}
                setCitas={setCitas}
            />
        </Box>
    );
}

function getColumnDefinitions(
    primaryColor,
    goToServicio,
    setOpen,
    setCita,
    servicios,
    updateEnServicio
) {
    return [
        {
            headerName: "Inicio",
            field: "hora",
            pinned: "left",
            // cellRenderer: HorarioCell,
            cellStyle: {
                justifyContent: "center",
                color: primaryColor,
                fontWeight: "bold",
                fontSize: "1rem",
            },
        },
        {
            headerName: "Salida",
            pinned: "left",
            valueGetter: ({ data }) =>
                addMinutesToTime(data.hora, data.minutos),
            width: 80,
            cellStyle: {
                justifyContent: "center",
            },
        },
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
            // pinned: "left",
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
            width: 100,
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
            width: 100,
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
            headerName: "En Servicio",
            cellRenderer: ({ data }) => (
                <EnServicioCell
                    data={data}
                    updateEnServicio={updateEnServicio}
                />
            ),
            width: 100,
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
                    servicios={servicios}
                />
            ),
            width: 150,
        },
    ];
}

function Actions({ data, setOpen, setCita, servicios }) {
    const buttonStyles = {
        variant: "surface",
        // colorPalette: "blue",
        size: "sm",
        // shadow: "sm",
        fontWeight: "600",
    };
    return (
        <HStack>
            <Button
                {...buttonStyles}
                colorPalette={"blue"}
                onClick={() => {
                    setOpen(true);
                    setCita(data);
                }}
                disabled={!servicios}
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

function EnServicioCell({ data, updateEnServicio }) {
    const [loading, setLoading] = useState(false);
    const onCheckedChange = async (e) => {
        setLoading(true);
        const resp = await updateEnServicio(
            data.cita_ID,
            e.checked ? 1 : 0
        );
        setLoading(false);
    };

    return (
        <HStack
            justifyContent={"center"}
            w={"100%"}
        >
            {loading && (
                <Spinner
                    size={"md"}
                    borderWidth={"3px"}
                    color={"blue.500"}
                />
            )}
            {!loading && (
                <Switch.Root
                    colorPalette={"blue"}
                    checked={data.en_servicio}
                    onCheckedChange={onCheckedChange}
                >
                    <Switch.HiddenInput />
                    <Switch.Control />
                </Switch.Root>
            )}
        </HStack>
    );
}

const getStylesRowStatus = (colors) => {
    const estilos = `
        .cita-pendiente {
            background-color: ${colors.yellow};
        }
        .cita-confirmada {
            background-color: ${colors.pink};
        }
        .cita-pagada {
            background-color: ${colors.gray};
        }
        .cita-en-servicio {
            background-color: ${colors.green};
        }
    `;
    return estilos;
};
