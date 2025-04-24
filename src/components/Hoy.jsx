// app/components/Calendar.jsx
// "use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import { Box, Button, Dialog, Portal, Avatar, Card } from "@chakra-ui/react";
import { LuBedSingle } from "react-icons/lu";
import { useEffect, useState } from "react";
import axios from "axios";
import esLocale from "@fullcalendar/core/locales/es"; // Import Spanish locale

export default function Hoy() {
    const [events, setEvents] = useState([]);
    const [resources, setResources] = useState([]);
    const [openDialogue, setOpenDialogue] = useState(false);
    const [currentEventDialogue, setCurrentEventDialogue] = useState([]);

    useEffect(() => {
        Promise.all([
            axios.get("/data/events.json"),
            axios.get("/api/camas"),
        ]).then(([eventsResp, resourcesResp]) => {
            setEvents(eventsResp.data);
            setResources(resourcesResp.data);
        });
    }, []);

    const handleEventPreview = (info) => {
        setOpenDialogue(true);
        console.log(info.event.toPlainObject());
        setCurrentEventDialogue(info.event.toPlainObject());
    };

    const formatHoyTitle = (date) => {
        const gmtString = date.date.marker.toGMTString(); // e.g., "Thu, 04 Apr 2025 00:00:00 GMT"
        const parts = gmtString.split(" ");
        const day = parts[1]; // "04"
        const month = parts[2]; // "Apr"
        const year = parts[3]; // "2025"

        // Map English month abbreviations to Spanish
        const monthMap = {
            Jan: "Enero",
            Feb: "Febrero",
            Mar: "Marzo",
            Apr: "Abril",
            May: "Mayo",
            Jun: "Junio",
            Jul: "Julio",
            Aug: "Agosto",
            Sep: "Septiembre",
            Oct: "Octubre",
            Nov: "Noviembre",
            Dec: "Diciembre",
        };

        const spanishMonth = monthMap[month];
        return `${parseInt(day)} de ${spanishMonth} de ${year}`; // "4 de Abril de 2025"
    };

    return (
        <div id="Hoy">
            <Dialog.Root
                id="Hoy"
                open={openDialogue}
                lazyMount
                placement={"center"}
                size={"lg"}
            >
                <CitaDialog
                    setOpenDialogue={setOpenDialogue}
                    data={currentEventDialogue}
                />

                <Box my="2rem">
                    <style>
                        {`
                            .fc-timegrid-slots {
                                // background-color: rgb(255, 238, 249); /* Set your desired color */
                                // background-color: rgb(255, 249, 254); /* Set your desired color */
                                background-color: white;
                                // background-color: transparent;
                            }

                            #Hoy .fc-toolbar-title {
                                font-size: 2.5rem !important;
                                font-weight: 200 !important;
                            }
                        `}
                    </style>
                    <FullCalendar
                        plugins={[timeGridPlugin, resourceTimeGridPlugin]}
                        initialView="resourceTimeGridDay"
                        resources={resources}
                        events={events}
                        initialDate={new Date()}
                        slotMinTime="09:00:00"
                        slotMaxTime="18:00:00"
                        expandRows={true}
                        height="160vh"
                        headerToolbar={{ left: "title", center: "", right: "" }}
                        allDaySlot={false} // Removes the all-day row
                        slotDuration="00:30:00"
                        slotLabelInterval="00:30:00"
                        resourceLabelContent={renderResourceLabel}
                        eventClick={handleEventPreview}
                        locales={[esLocale]} // Include the Spanish locale
                        titleFormat={formatHoyTitle}
                    />
                </Box>
            </Dialog.Root>
        </div>
    );
}

function CitaDialog({ setOpenDialogue, data }) {
    return (
        <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content
                    py={"3rem"}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                >
                    {/* <Dialog.Header>
                      <Dialog.Title>Dialog Title</Dialog.Title>
                  </Dialog.Header> */}
                    <Dialog.Body>
                        <Card.Root>
                            <Card.Body gap="4">
                                <Avatar.Root size="lg" shape="rounded">
                                    <Avatar.Image src="https://picsum.photos/200/300" />
                                    <Avatar.Fallback name="Nue Camp" />
                                </Avatar.Root>
                                <Card.Title mt="2">{data.title}</Card.Title>
                                <Card.Description>
                                    <b>Inicia:</b> {data.start}
                                </Card.Description>
                                <Card.Description>
                                    <b>Termina:</b> {data.end}
                                </Card.Description>
                            </Card.Body>
                            <Card.Footer justifyContent="flex-end">
                                {/* <Button variant="outline">Cerrar</Button> */}
                                <Button
                                    onClick={() => {
                                        setOpenDialogue(false);
                                    }}
                                >
                                    Cerrar
                                </Button>
                            </Card.Footer>
                        </Card.Root>
                    </Dialog.Body>
                </Dialog.Content>
            </Dialog.Positioner>
        </Portal>
    );
}

function renderResourceLabel(info) {
    return (
        <div style={{ padding: "8px", textAlign: "center" }}>
            <img
                style={{ width: "4rem", marginBottom: "0.5rem" }}
                src={"img/lashistas/" + info.resource.extendedProps.src}
            />
            <p
                style={{
                    marginBottom: "0.5rem",
                    fontWeight: "300",
                    fontSize: "1.2rem",
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
                    style={{ fontSize: "1.4rem", color: "rgb(228, 129, 167)" }}
                />
                <span
                    style={{
                        fontSize: "1.2rem",
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
