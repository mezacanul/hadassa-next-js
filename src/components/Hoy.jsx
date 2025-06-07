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
    HStack,
    Image,
    Text,
    Badge,
    VStack,
    CloseButton,
} from "@chakra-ui/react";
import { LuBedSingle } from "react-icons/lu";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import esLocale from "@fullcalendar/core/locales/es"; // Import Spanish locale
import { loadHook } from "@/utils/lattice-design";
import { parse, format, addMinutes } from "date-fns";
import { useRouter as useNextNav } from "next/navigation";

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
                            .get(`/api/citas?date=${selectedDate}`)
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
        <Box id="Hoy" bg={"white"}>
            <Dialog.Root
                id="Hoy"
                open={openDialogue}
                closeOnInteractOutside
                // lazyMount
                placement={"center"}
                size={"md"}
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
                        slotMinTime="09:00:00"
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
                                    <b
                                        style={{
                                            fontSize: "0.7rem",
                                            color: "black",
                                        }}
                                    >
                                        {arg.event.title}
                                    </b>
                                    <p
                                        style={{
                                            fontSize: "0.7rem",
                                            color: "black",
                                        }}
                                    >
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
        </Box>
    );
}

function CitaDialog({ setOpenDialogue, data }) {
    const NextNav = useNextNav();
    const citaData = { ...data.extendedProps };
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
                        <Card.Root
                            // shadow={"md"}
                            w={"25rem"}
                            py={"1rem"}
                            px={"1rem"}
                            borderColor={"pink.500"}
                            borderWidth={"2px"}
                        >
                            <Card.Body gap="4">
                                <HStack
                                    justify={"center"}
                                    w={"100%"}
                                    mb={"1rem"}
                                >
                                    <VStack>
                                        <Image
                                            w={"12rem"}
                                            h={"12rem"}
                                            borderRadius={"50%"}
                                            src={`/img/clientas/${
                                                citaData.foto
                                                    ? clienta.foto
                                                    : "avatar-woman.png"
                                            }`}
                                            objectFit={"cover"}
                                        />
                                        <Text
                                            mt={"1rem"}
                                            fontSize={"1rem"}
                                        >{`${citaData.nombres} ${citaData.apellidos}`}</Text>
                                    </VStack>
                                </HStack>
                                <Card.Title
                                    fontSize={"1.5rem"}
                                    mt={0}
                                    mb={"0.5rem"}
                                    color={"pink.700"}
                                >
                                    {citaData.servicio}
                                </Card.Title>

                                <Card.Description
                                    justifyContent={"space-between"}
                                    display={"flex"}
                                >
                                    <Text as="span">Hora:</Text>
                                    <Text as="span" fontWeight={800}>
                                        {citaData.hora}
                                        {" a.m."}
                                    </Text>
                                </Card.Description>
                                <Card.Description
                                    justifyContent={"space-between"}
                                    display={"flex"}
                                >
                                    <Text as="span">Lashista:</Text>
                                    <Text as="span" fontWeight={800}>
                                        {citaData.lashista}
                                    </Text>
                                </Card.Description>
                                <Card.Description
                                    justifyContent={"space-between"}
                                    display={"flex"}
                                    w={"100%"}
                                >
                                    <Text as="span">Total a Pagar:</Text>
                                    <Text as="span" fontWeight={800}>
                                        {/* <Badge
                                                size={"md"}
                                                me={"1rem"}
                                                colorPalette={"green"}
                                            >
                                                Pagado
                                            </Badge> */}
                                        {`$${citaData.precio}`}
                                    </Text>
                                </Card.Description>
                            </Card.Body>
                            <Card.Footer justifyContent="center" mt={"2rem"}>
                                <Button
                                    bg={"pink.600"}
                                    onClick={() => {
                                        NextNav.push(`/citas/1`);
                                    }}
                                >
                                    Abrir Ticket
                                </Button>
                            </Card.Footer>
                        </Card.Root>
                    </Dialog.Body>
                    <Dialog.CloseTrigger top="0" insetEnd="-12" asChild>
                        <CloseButton
                            onClick={() => {
                                setOpenDialogue(false);
                            }}
                            bg="bg"
                            size="sm"
                        />
                    </Dialog.CloseTrigger>
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
        // console.log(eventsData);

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
            console.log(dateWithTime, ed.duracion);

            const end = format(dateWithAddedTime, "yyyy-MM-dd'T'HH:mm:ss");

            // console.log(start, end); // "2025-04-25T09:00:00"
            return {
                title: `${ed.nombres} ${ed.apellidos}`,
                start: start,
                end: end,
                resourceId: ed.cama_id,
                extendedProps: {
                    ...ed,
                },
            };
        });
    }
}
