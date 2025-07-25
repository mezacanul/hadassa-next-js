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
import esLocale from "@fullcalendar/core/locales/es"; // Import Spanish locale
import { CiSquarePlus } from "react-icons/ci";
import { LuBedSingle } from "react-icons/lu";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { format, parse } from "date-fns";
import { loadHook } from "@/utils/lattice-design";
import { IoMdToday } from "react-icons/io";

// import { useCalendarControl } from "@/pages";
// import { useCalendarControl } from "./Hoy";
// import { useHoyRef } from "@/pages";
// import { useHoyRef } from "@/pages/nueva-cita/[date]";
// import { useHoyRef } from "./Hoy";
// import interactionPlugin from '@fullcalendar/interaction';

export default function CalendarioMes() {
    const calendarRef = useRef(null);
    const router = useRouter();
    const [openDialogue, setOpenDialogue] = useState(false);
    // const [selectedDate, setSelectedDate] = useState("");
    const [displayedMonthIndex, setDisplayedMonthIndex] = useState(
        new Date().getMonth()
    );
    const [selectedDate, setSelectedDate] = loadHook("useSelectedDate");
    // const [hoyRef, setHoyRef] = useHoyRef()
    // const [calendarControl ] = useCalendarControl();

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
        // console.log("Displayed Year: ", date.date.year);

        const month = monthNames[displayedMonthIndex];
        const year = date.date.year;
        return `${month} de ${year}`;
    };

    useEffect(() => {
        // console.log("Displayed Month Index: ", displayedMonthIndex);
    }, [displayedMonthIndex]);

    // function handleDayClick() {
    //     console.log(hoyRef);
    // }

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
        <VStack id="MesCalendar">
            {/* <Button onClick={()=>{
                console.log(hoyRef);
            }}>
                hoyRef
            </Button> */}
            <Box width="100%">
                <style>{DayGridStyles}</style>
                <style>{MesCalendarStyles}</style>
                <FullCalendar
                    // initialDate={new Date("25-04-2025")}
                    ref={calendarRef}
                    selectable={true}
                    dayCellContent={DayBox(
                        router,
                        displayedMonthIndex,
                        selectedDate,
                        <IoMdToday />
                    )}
                    // events={events}
                    // eventContent={renderEventContent}
                    datesSet={(dateInfo) => {
                        setDisplayedMonthIndex(
                            dateInfo.view.currentStart.getMonth()
                        ); // Update on month change
                    }}
                    height="85vh"
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    weekends={true}
                    hiddenDays={[0]}
                    locales={[esLocale]} // Include the Spanish locale
                    titleFormat={formatDateTitleOnMonthCalendar}
                    customButtons={{
                        today: {
                            text: "Hoy",
                            click: function () {
                                calendarRef.current.getApi().today(); // Default "today" behavior
                                setSelectedDate(null);
                                console.log("Today button clicked!"); // Your callback
                                // Add your custom logic here
                            },
                        },
                    }}
                    dayCellDidMount={(info) => {
                        // Check if date is today and add class on mount
                        const today = new Date();
                        const formattedToday = format(today, "yyyy-MM-dd");
                        const formattedDate = format(info.date, "yyyy-MM-dd");
                        if (formattedDate === formattedToday) {
                            info.el.classList.add("day-clicked");
                        }

                        info.el.addEventListener("click", () => {
                            const formattedDate = format(
                                info.date,
                                "yyyy-MM-dd"
                            );
                            setSelectedDate(formattedDate);
                            document
                                .querySelectorAll("td.fc-daygrid-day")
                                .forEach((td) => {
                                    td.classList.remove("day-clicked");
                                });
                            info.el.classList.add("day-clicked");
                            console.log("INFO", info, info.el);
                        });
                    }}
                    eventClick={(info) => {
                        console.log("info", info);
                    }}
                />
            </Box>
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

const DayBox = (router) => (info) => {
    // console.log("day cell info", info);
    const formattedDate = format(info.date, "yyyy-MM-dd");
    const today = format(new Date(), "yyyy-MM-dd");
    // console.log("today", today, formattedDate);

    // DEV:
    // We parse and format the Date to be URL friendly
    const handleNuevaCita = () => {
        const dateStr = info.date.toLocaleDateString();
        const date = parse(dateStr, "M/d/yyyy", new Date());
        const formattedDate = format(date, "dd-MM-yyyy");
        console.log(formattedDate);
        // console.log(info.date.toLocaleDateString());
        // router.push(`/nueva-cita/${formattedDate}`);
    };

    return (
        <div>
            <p>{info.dayNumberText}</p>
            <p style={{ fontSize: "1.2rem", marginTop: "0.5rem" }}>
                {today == formattedDate && "Hoy"}
            </p>
        </div>
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

const MesCalendarStyles = `
    #MesCalendar table {
        background-color: white;
    }

    #MesCalendar .fc-day-today {
        background: transparent;
    }

    #MesCalendar .fc-day-today .fc-daygrid-day-frame {
        border: 2px solid #ec4899;
        opacity: 0.9;
    }

    #MesCalendar .fc-button {
        padding: 5px;
    }

    .fc-timegrid-slots {
        background-color: white;
    }

    .fc-daygrid-day:hover, #MesCalendar .fc-day-today:hover {
        cursor: pointer;
        background-color:rgba(236, 32, 134, 0.18);
    }

    .fc-day-today.fc-daygrid-day:hover .fc-daygrid-day-number {
        color: black;
    }

    #MesCalendar .fc-toolbar-title {
        // font-size: 2.5rem !important;
        font-weight: 300 !important;
    }

    #MesCalendar .fc-header-toolbar {
        // flex-direction: row-reverse;
    }

    #MesCalendar .fc-header-toolbar .fc-toolbar-chunk:nth-child(3) {
        display: flex;
        flex-direction: row-reverse;
        gap: 1rem;
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

    td.day-clicked {
        background-color: #ec4899 !important;
    }
    
    td.day-clicked .fc-daygrid-day-number {
        color: white !important;
    }
`;

const DayGridStyles = `
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
`;
