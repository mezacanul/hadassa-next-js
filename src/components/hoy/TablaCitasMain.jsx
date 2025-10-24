import BadgeCustom from "../common/BadgeCustom";
import {
    Box,
    Text,
    HStack,
    Spinner,
    Button,
    Badge,
} from "@chakra-ui/react";
import "@/config/agGridSetup";
import { AgGridReact } from "ag-grid-react";
import {
    FaCalendarCheck,
    FaCalendarXmark,
    FaWhatsapp,
} from "react-icons/fa6";
import { BsWhatsapp } from "react-icons/bs";
import { useEffect, useState } from "react";
import StatusBadge from "../common/StatusBadge";
import { IoLogoWhatsapp } from "react-icons/io";
import ModalAccionesCita from "./ModalAccionesCita";

export default function TablaCitasMain({
    citas,
    primaryColor,
    goToServicio,
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
                        setCita
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
            />
        </Box>
    );
}

function getColumnDefinitions(
    primaryColor,
    goToServicio,
    setOpen,
    setCita
) {
    return [
        {
            headerName: "Inicio",
            field: "hora",
            cellStyle: {
                fontWeight: "bold",
                // fontSize: "1rem",
                color: primaryColor,
                justifyContent: "center",
            },
            pinned: "left",
        },
        // {
        //     headerName: "Salida",
        //     // field: "hora_fin",
        //     valueGetter: (params) => "--",
        //     cellStyle: {
        //         justifyContent: "center",
        //     },
        // },
        {
            headerName: "Nombre",
            // field: "lashista",
            valueGetter: (params) =>
                `${params.data.nombres} ${params.data.apellidos}`,
            // cellRenderer: renderResourceLabel,
            // flex: 3,
            pinned: "left",
        },
        {
            headerName: "Servicio",
            field: "servicio",
            // flex: 3,
            cellStyle: {
                // fontWeight: "bold",
                // textDecoration: "underline",
            },
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
            headerName: "Costo",
            // field: "costo",
            valueGetter: (params) => "--",
            cellStyle: {
                justifyContent: "center",
            },
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
            {/* <Button
                {...buttonStyles}
                colorPalette={"blue"}
            >
                <FaCalendarCheck />
            </Button>
            <Button
                {...buttonStyles}
                colorPalette={"green"}
            >
                <BsWhatsapp />
                {"Rec."}
            </Button>
            <Button
                {...buttonStyles}
                colorPalette={"green"}
            >
                <BsWhatsapp />
                {"Conf."}
            </Button>
            <Button
                {...buttonStyles}
                colorPalette={"red"}
            >
                <FaCalendarXmark />
            </Button> */}
        </HStack>
    );
}
