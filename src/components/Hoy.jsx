// app/components/Calendar.jsx
// "use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import {
    Box,
    Button,
    Dialog,
    Portal,
    Avatar,
    Card,
    Heading,
} from "@chakra-ui/react";
import { LuBedSingle } from "react-icons/lu";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import esLocale from "@fullcalendar/core/locales/es"; // Import Spanish locale
import { loadHook } from "@/utils/lattice-design";
import { parse, format, addMinutes } from "date-fns";

export default function Hoy() {
    // const [events, setEvents] = useState([]);
    const [events, setEvents] = loadHook("useEvents");
    const [resources, setResources] = useState(null);
    const [openDialogue, setOpenDialogue] = useState(false);
    const [currentEventDialogue, setCurrentEventDialogue] = useState([]);
    const calendarRef = useRef(null); // Create a ref for the calendar
    const [selectedDate, setSelectedDate] = loadHook("useSelectedDate");

    useEffect(() => {
        const formattedToday = format(new Date(), "yyyy-MM-dd");

        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            // console.log("selectedDate:", selectedDate);

            // -- DEV: We set the current date to today's date
            // when first mounting the Hoy component
            if (selectedDate == null) {
                setSelectedDate(formattedToday);
            } else {
                console.log("Catched! Date updated ->", selectedDate);
                // -- DEV: When selectDate updates for the first time, it is the same as today
                try {
                    // Use setTimeout to defer the state update to a microtask
                    setTimeout(() => {
                        axios
                            .post("/api/citas", { date: selectedDate })
                            .then((citasResp) => {
                                console.log(citasResp.data);
                                setEvents(formatEvents(citasResp.data));
                                calendarApi.gotoDate(selectedDate);
                                console.log("Updated Today's View");
                                // console.log(citasResp.data);
                            });
                    }, 0);
                } catch (error) {
                    console.error("Error navigating to date:", error);
                }
            }
        }
    }, [selectedDate]);

    useEffect(() => {
        Promise.all([axios.get("/api/camas")]).then(([camasResp]) => {
            setResources(camasResp.data);
        });
    }, []);

    const handleEventPreview = (info) => {
        setOpenDialogue(true);
        console.log(info.event.toPlainObject());
        setCurrentEventDialogue(info.event.toPlainObject());
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

                <Box>
                    <style>
                        {`
                            #Hoy .fc-timegrid-slot-label-cushion {
                                font-size: 0.85rem;
                            }

                            #Hoy .fc-timegrid-slots {
                                // background-color: rgb(255, 238, 249); /* Set your desired color */
                                // background-color: rgb(255, 249, 254); /* Set your desired color */
                                background-color: white;
                                // background-color: transparent;
                            }
                            
                            #Hoy .fc-header-toolbar {
                                display: none;
                            }

                            #Hoy .fc-toolbar-title {
                                font-size: 2.5rem !important;
                                font-weight: 200 !important;
                            }

                            #Hoy .fc-v-event {
                                background-color: #fce7f3 !important;
                                border: 2px solid #ec4899 !important;
                                opacity: 0.9;
                            }
                        `}
                    </style>
                    <FullCalendar
                        ref={calendarRef} // Attach the ref to FullCalendar
                        plugins={[timeGridPlugin, resourceTimeGridPlugin]}
                        initialView="resourceTimeGridDay"
                        resources={resources}
                        events={events}
                        initialDate={new Date()}
                        // initialDate={new Date("04-25-2025")}
                        slotMinTime="09:30:00"
                        slotMaxTime="18:00:00"
                        expandRows={true}
                        height="200vh"
                        // headerToolbar={{ left: "title", center: "", right: "" }}
                        headerToolbar={{ left: "", center: "", right: "" }}
                        allDaySlot={false} // Removes the all-day row
                        slotDuration="00:30:00"
                        slotLabelInterval="00:30:00"
                        resourceLabelContent={renderResourceLabel}
                        eventClick={handleEventPreview}
                        locales={[esLocale]} // Include the Spanish locale
                        // titleFormat={formatHoyTitle}
                        slotLabelFormat={{
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                        }}
                        eventContent={(arg) => {
                            return (
                                <div style={{ marginLeft: "0.3rem" }}>
                                    <b style={{ fontSize: "0.7rem", color: "black" }}>
                                        {arg.event.title}
                                    </b>
                                    <p style={{ fontSize: "0.7rem", color: "black" }}>
                                        {arg.event.extendedProps.servicio}
                                    </p>
                                </div>
                            );
                        }}
                        // viewDidMount={() => {
                        //     console.log("viewDidMount hoyRef:", hoyRef);
                        //     // Optionally test the API here
                        //     if (hoyRef) {
                        //         hoyRef.gotoDate("2025-04-30"); // Test navigation
                        //     } else {
                        //         console.log("No Hoy ref found");
                        //     }
                        // }}
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
                style={{ width: "3.5rem", marginBottom: "0.5rem" }}
                src={"img/lashistas/" + info.resource.extendedProps.src}
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
                    style={{ fontSize: "1.2rem", color: "rgb(228, 129, 167)" }}
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

export function formatEvents(eventsData) {
    if (eventsData != null) {
        return eventsData.map((ed) => {
            // Split the date into parts and rearrange
            const [day, month, year] = ed.fecha.split("-");
            const formattedDate = `${year}-${month}-${day}`;
            // Combine with the time and add seconds
            // const start = `${formattedDate}T${ed.hora}:00`;
            const start = `${formattedDate}T${ed.hora}:00`;

            // Parse the date and time into a Date object
            const parsedDate = parse(ed.fecha, "dd-MM-yyyy", new Date());
            const [hours, minutes] = ed.hora.split(":");
            const dateWithTime = new Date(
                parsedDate.setHours(hours, minutes, 0)
            );
            // Add minutes
            const dateWithAddedTime = addMinutes(dateWithTime, ed.duracion);
            // Format the result
            const end = format(dateWithAddedTime, "yyyy-MM-dd'T'HH:mm:ss");

            // console.log(start, end); // "2025-04-25T09:00:00"
            return {
                title: `${ed.clienta}`,
                start: start,
                end: end,
                resourceId: ed.cama_id,
                extendedProps: {
                    servicio: ed.servicio,
                    servicio_id: ed.servicio_id,
                    duracion: ed.duracion
                },
            };
        });
    }
}