"use client";

import {
    Box,
    Heading,
    Text,
    VStack,
} from "@chakra-ui/react";
import { LuBedSingle } from "react-icons/lu";
import { useEffect, useState } from "react";
import axios from "axios";
import { loadHook } from "@/utils/lattice-design";
import { format } from "date-fns";
import { useRouter as useNextNav } from "next/navigation";
import { CDN } from "@/config/cdn";
import { AgGridReact } from "ag-grid-react";
import "@/config/agGridSetup";
import { sortByHora } from "@/utils/disponibilidad";
import { useToken } from "@chakra-ui/react";

export default function Hoy() {
    const primaryColor = useToken("colors", "blue.600");
    const [loading, setLoading] = loadHook("useLoader");
    const [resources, setResources] = useState(null);
    const [selectedDate, setSelectedDate] = loadHook(
        "useSelectedDate"
    );
    const [citas, setCitas] = useState(null);
    const [lashistas, setLashistas] = useState(null);
    const [eventos, setEventos] = useState(null);
    const NextNav = useNextNav();
    // const [events, setEvents] = loadHook("useEvents");

    useEffect(() => {
        // -- DEV: When selectDate updates for the first time, it is the same as today
        if (selectedDate == null) {
            const formattedToday = format(
                new Date(),
                "yyyy-MM-dd"
            );
            console.log("formattedToday", formattedToday);
            setSelectedDate(formattedToday);
        }
    }, []);

    useEffect(() => {
        if (selectedDate != null) {
            // return;
            console.log("Date updated! ->", selectedDate);
            try {
                // Use setTimeout to defer the state update to a microtask
                setTimeout(() => {
                    Promise.all([
                        axios.get(
                            `/api/citas?date=${selectedDate}`
                        ),
                        axios.get(
                            `/api/eventos?fecha=${selectedDate}`
                        ),
                        axios.get(`/api/lashistas`),
                    ]).then(
                        ([
                            citasResp,
                            eventosResp,
                            lashistasResp,
                        ]) => {
                            console.log(
                                "Responses",
                                eventosResp.data,
                                citasResp.data,
                                lashistasResp.data
                            );

                            setEventos(eventosResp.data);
                            const sortedCitas = sortByHora(
                                citasResp.data
                            );
                            setCitas(sortedCitas);
                            // setCitas(citasResp.data);
                            setLashistas(
                                lashistasResp.data
                            );
                            console.log(
                                "Updated Today's View"
                            );
                        }
                    );
                }, 0);
            } catch (error) {
                console.error(
                    "Error navigating to date:",
                    error
                );
            }
        }
    }, [selectedDate]);

    const handleEventPreview = (info) => {
        // const { cita_ID } = info.event["_def"].extendedProps
        const cita = info.event["_def"].extendedProps;
        if (cita.status != 3) {
            setLoading(true);
            NextNav.push(`/citas/${cita.cita_ID}`);
            // console.log(info.event.toPlainObject());
        }
    };

    return (
        <Box
            id="Hoy"
            // bg={"white"}
        >
            <Box>
                <Heading>Hoy</Heading>

                <Box
                    my={"1rem"}
                    h={"70vh"}
                    id={"AG-Table"}
                    w={"100%"}
                >
                    {citas && (
                        <AgGridReact
                            rowData={citas}
                            columnDefs={getColumnDefinitions(primaryColor)}
                            rowHeight={60}
                            autoSizeStrategy={{
                                type: "fitCellContents",
                            }}
                            defaultColDef={{
                                resizable: true,
                                flex: 1,
                                cellStyle: {
                                    display: "flex",
                                    // justifyContent: "center",
                                    alignItems: "center",
                                },
                            }}
                            // quickFilterText={searchTerm}
                        />
                    )}
                </Box>
            </Box>
        </Box>
    );
}

function getColumnDefinitions(primaryColor) {
    return [
        {
            headerName: "Hora",
            field: "hora",
            cellStyle: {
                fontWeight: "bold",
                fontSize: "1rem",
                color: primaryColor
            },
        },
        {
            headerName: "Servicio",
            field: "servicio",
            flex: 2,
            cellStyle: {
                // fontWeight: "bold",
                textDecoration: "underline",
            },
        },
        {
            headerName: "Nombre",
            // field: "lashista",
            valueGetter: (params) =>
                `${params.data.nombres} ${params.data.apellidos}`,
            // cellRenderer: renderResourceLabel,
            flex: 2,
        },
        {
            headerName: "Pagado",
            field: "pagado",
        },
        {
            headerName: "Status",
            field: "status",
        },
        {
            headerName: "Acciones",
            field: "acciones",
        },
    ];
}

function renderResourceLabel(info) {
    return (
        <div
            style={{ padding: "8px", textAlign: "center" }}
        >
            <img
                style={{
                    width: "3.5rem",
                    marginBottom: "0.5rem",
                }}
                src={
                    `${CDN}/img/lashistas/` +
                    info.resource.extendedProps.src
                }
            />
            <p
                style={{
                    marginBottom: "0.2rem",
                    fontWeight: "300",
                    fontSize: "1rem",
                }}
            >
                {info.resource.title}
            </p>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <LuBedSingle
                    style={{
                        fontSize: "1.2rem",
                        color: "rgb(228, 129, 167)",
                    }}
                />
                <span
                    style={{
                        fontSize: "1rem",
                        fontWeight: "bold",
                        marginLeft: "0.3rem",
                        color: "rgb(228, 129, 167)",
                    }}
                >
                    - {info.resource.id.slice(-1)}
                </span>
            </div>
        </div>
    );
}
