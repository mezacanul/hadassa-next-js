"use client";

import BadgeCustom from "./common/BadgeCustom";
import {
    Box,
    Grid,
    Heading,
    HStack,
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
import { formatFechaDMY } from "@/utils/main";
import TablaCitasMain from "./hoy/TablaCitasMain";
import TablaEventosMain from "./hoy/TablaEventosMain";
import { Form } from "react-bootstrap";

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
    const [servicios, setServicios] = useState(null);
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
        axios
            .get("/api/servicios")
            .then((serviciosResp) => {
                setServicios(serviciosResp.data);
            });
    }, []);

    useEffect(() => {
        if (selectedDate != null) {
            // return;
            setCitas(null);
            setEventos(null);
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
                        // axios.get(`/api/lashistas`),
                    ]).then(
                        ([
                            citasResp,
                            eventosResp,
                            // lashistasResp,
                        ]) => {
                            console.log(
                                "Responses",
                                eventosResp.data,
                                citasResp.data
                                // lashistasResp.data
                            );

                            setEventos(eventosResp.data);
                            const sortedCitas = sortByHora(
                                citasResp.data
                            );
                            setCitas(sortedCitas);
                            // setCitas(citasResp.data);
                            // setLashistas(
                            //     lashistasResp.data
                            // );
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

    const goToServicio = (citaID) => {
        setLoading(true);
        NextNav.push(`/citas/${citaID}`);
    };

    return (
        <VStack
            gap={"1rem"}
            id="Hoy"
            // bg={"white"}
            w={"100%"}
        >
            <Box w={"100%"}>
                <HStack>
                    <Text fontSize={"2xl"}>Citas</Text>
                    {/* <Form.Control type="date" /> */}
                </HStack>

                <TablaCitasMain
                    citas={citas}
                    setCitas={setCitas}
                    primaryColor={primaryColor}
                    goToServicio={goToServicio}
                    servicios={servicios}
                />
            </Box>

            <Box w={"100%"}>
                <Text fontSize={"xl"}>Eventos</Text>
                <TablaEventosMain
                    eventos={eventos}
                    primaryColor={primaryColor}
                />
            </Box>
        </VStack>
    );
}
