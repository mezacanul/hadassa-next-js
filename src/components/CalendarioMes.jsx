import {
    Avatar,
    Box,
    Button,
    Card,
    Dialog,
    Link,
    Portal,
    Select,
    Text,
    VStack,
} from "@chakra-ui/react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { CiSquarePlus } from "react-icons/ci";
import { LuBedSingle } from "react-icons/lu";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format, parse } from "date-fns";
import esLocale from "@fullcalendar/core/locales/es"; // Import Spanish locale

export default function CalendarioMes() {
    const router = useRouter();
    const [openDialogue, setOpenDialogue] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [displayedMonthIndex, setDisplayedMonthIndex] = useState(
        new Date().getMonth()
    );

    const handleDayClick = (info) => {
        console.log(info.dayNumberText);
        alert(info.dayNumberText);
    };

    const formatDateTitleOnMonthCalendar = (date) => {
        const monthNames = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
        ];
        console.log("Displayed Year: ", date.date.year);
        
        const month = monthNames[displayedMonthIndex];
        const year = date.date.year;
        return `${month} de ${year}`;
    };

    useEffect(() => {
        console.log("Displayed Month Index: ", displayedMonthIndex);
    }, [displayedMonthIndex]);

    return (
        // <Dialog.Root
        //     open={openDialogue}
        //     lazyMount
        //     placement={"center"}
        //     size={"lg"}
        // >
        //     <AgendarCitaModal
        //         setOpenDialogue={setOpenDialogue}
        //         selectedDate={selectedDate}
        //         // data={currentEventDialogue}
        //     />
        <VStack mt={"2rem"} py="1rem" px="2rem" id="MesCalendar">
            <Box width="100%">
                <DayGridStyles />

                <style>
                        {`
                            .fc-timegrid-slots {
                                // background-color: rgb(255, 238, 249); /* Set your desired color */
                                // background-color: rgb(255, 249, 254); /* Set your desired color */
                                background-color: white;
                                // background-color: transparent;
                            }

                            #MesCalendar .fc-toolbar-title {
                                // font-size: 2.5rem !important;
                                font-weight: 300 !important;
                            }

                            #MesCalendar .fc-header-toolbar {
                                flex-direction: row-reverse;
                            }
                            
                            .fc-button {
                                background-color: #ec4899 !important;
                                border-color: #ec4899 !important;
                                transition: all ease 0.3s;
                            }
                             
                            .fc-button:hover {
                                // background-color:rgb(210, 57, 133) !important;
                                // border-color: rgb(183, 35, 109) !important;
                                transform: scale(1.1);
                            }
                        `}
                    </style>
                <FullCalendar
                    dayCellContent={renderDayCellContent(
                        router,
                        displayedMonthIndex
                    )}
                    eventContent={renderEventContent}
                    datesSet={(dateInfo) => {
                        setDisplayedMonthIndex(
                            dateInfo.view.currentStart.getMonth()
                        ); // Update on month change
                    }}
                    height="60vh"
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    weekends={true}
                    hiddenDays={[0]}
                    locales={[esLocale]} // Include the Spanish locale
                    titleFormat={formatDateTitleOnMonthCalendar}
                    // events={events}
                    // selectable={true}
                    // dayCellDidMount={(info) => {
                    //   info.el.addEventListener("click", () => {
                    //     handleDayClick(info)
                    //   });
                    // }}
                />
            </Box>

            <VStack
                fontSize={"1.5rem"}
                h={"30vh"}
                w={"100%"}
                align={"end"}
                justify={"space-evenly"}
            >
                <Link color={"pink.500"}>Citas</Link>
                <Link color={"pink.500"}>Clientas</Link>
                <Link color={"pink.500"}>Servicios</Link>
                <Link color={"pink.500"}>Lashistas</Link>
            </VStack>
        </VStack>
        // </Dialog.Root>
    );
}

function renderEventContent(eventInfo) {
    let color = eventInfo.event.title == "Disponible" ? "#198754" : "#6c757d";
    return (
        <Box bg={color} p={"0.2rem"}>
            <Text>{eventInfo.event.title}</Text>
        </Box>
    );
}

const renderDayCellContent = (router, displayedMonthIndex) => (info) => {
    // function renderDayCellContent(info) {
    const calendarMonthIndex = info.date.getUTCMonth();
    const isInCurrentMOnth =
        calendarMonthIndex == displayedMonthIndex ? true : false;

    // DEV:
    // We parse and format the Date to be URL friendly
    const handleNuevaCita = () => {
        const dateStr = info.date.toLocaleDateString();
        const date = parse(dateStr, "M/d/yyyy", new Date());
        const formattedDate = format(date, "dd-MM-yyyy");
        console.log(formattedDate);
        // console.log(info.date.toLocaleDateString());
        router.push(`/nueva-cita/${formattedDate}`);
    };

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <span>{info.dayNumberText}</span>
            {isInCurrentMOnth && (
                <CiSquarePlus
                    style={{ fontSize: "1.5rem", cursor: "pointer" }}
                    onClick={handleNuevaCita}
                />
            )}
        </div>
    );
};

const DayGridStyles = () => {
    return (
        <style>
            {`
              .fc-daygrid-day {
                // background-color:rgba(238, 144, 144, 0.5) !important; /* Set your desired background color */
                //background-color:rgba(144, 238, 144, 0.5) !important; /* Set your desired background color */
              }
              
              .fc-daygrid-day-top {
                justify-content: center;
              }

              .fc-daygrid-day-number {
              width: 100%;
              }
              .fc-daygrid-day-number div {
              width: 100%;
              justify-content: space-between !important;
              padding-left: 10px;
              padding-right: 10px;
              }
            `}
        </style>
    );
};

function AgendarCitaModal({ setOpenDialogue, selectedDate, data }) {
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
                    <Dialog.Header>
                        <Dialog.Title>Agendar Nueva Cita</Dialog.Title>
                    </Dialog.Header>

                    <CitaForm
                        selectedDate={selectedDate}
                        setOpenDialogue={setOpenDialogue}
                    />
                </Dialog.Content>
            </Dialog.Positioner>
        </Portal>
    );
}

function CitaForm({ selectedDate, setOpenDialogue }) {
    return (
        <Dialog.Body w={"30vw"}>
            <Card.Root>
                <Card.Body gap="4" w={"30vw"} mb={"2rem"}>
                    <Card.Title mt="2">{selectedDate}</Card.Title>
                    <Card.Description>
                        <p>Servicio</p>
                        <select>
                            <option value="test">test</option>
                        </select>
                    </Card.Description>
                    <Card.Description>
                        <b>Lashista:</b> TEST
                    </Card.Description>
                    <Card.Description>
                        <b>Hora:</b> TEST
                    </Card.Description>
                </Card.Body>

                <Card.Footer justifyContent="flex-end">
                    {/* <Button variant="outline">Cerrar</Button> */}
                    <Button
                        colorPalette={"yellow"}
                        onClick={() => {
                            setOpenDialogue(false);
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        colorPalette={"blue"}
                        onClick={() => {
                            setOpenDialogue(false);
                        }}
                    >
                        Guardar
                    </Button>
                </Card.Footer>
            </Card.Root>
        </Dialog.Body>
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

const events = [
    { title: "Lleno", start: "2025-03-03" },
    { title: "Lleno", start: "2025-03-04" },
    { title: "Disponible", start: "2025-03-05" },
    { title: "Disponible", start: "2025-03-06" },
    { title: "Lleno", start: "2025-03-07" },

    { title: "Disponible", start: "2025-03-10" },
    { title: "Disponible", start: "2025-03-11" },
    { title: "Lleno", start: "2025-03-12" },
    { title: "Disponible", start: "2025-03-13" },
    { title: "Lleno", start: "2025-03-14" },

    { title: "Disponible", start: "2025-03-17" },
    { title: "Disponible", start: "2025-03-18" },
    { title: "Lleno", start: "2025-03-19" },
    { title: "Disponible", start: "2025-03-20" },
    { title: "Disponible", start: "2025-03-21" },

    { title: "Disponible", start: "2025-03-24" },
    { title: "Lleno", start: "2025-03-25" },
    { title: "Disponible", start: "2025-03-26" },
    { title: "Disponible", start: "2025-03-27" },
    { title: "Lleno", start: "2025-03-28" },

    { title: "Disponible", start: "2025-03-31" },
];
