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
import { useState } from "react";
import { useRouter } from "next/navigation";
import { format, parse } from "date-fns";

export default function CalendarioMes() {
    const router = useRouter();
    const [openDialogue, setOpenDialogue] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");

    const handleDayClick = (info) => {
        console.log(info.dayNumberText);
        alert(info.dayNumberText);
    };

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
        <VStack py="1rem" px="2rem">
            <Box width="100%">
                <DayGridStyles />
                <FullCalendar
                    height="60vh"
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    weekends={true}
                    hiddenDays={[0]}
                    // events={events}
                    eventContent={renderEventContent}
                    // selectable={true}
                    // dayCellDidMount={(info) => {
                    //   info.el.addEventListener("click", () => {
                    //     handleDayClick(info)
                    //   });
                    // }}
                    dayCellContent={renderDayCellContent(router)}
                />
            </Box>

            <VStack
                fontSize={"1.5rem"}
                h={"30vh"}
                w={"100%"}
                align={"end"}
                justify={"space-evenly"}
            >
                <Link>Citas</Link>
                <Link>Clientas</Link>
                <Link>Servicios</Link>
                <Link>Lashistas</Link>
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

const renderDayCellContent = (router) => (info) => {
    // function renderDayCellContent(info) {

    const handleNuevaCita = () => {
        const dateStr = info.date.toLocaleDateString()
        const date = parse(dateStr, "M/d/yyyy", new Date());
        const formattedDate = format(date, "dd-MM-yyyy"); // "30-4-2025"
        console.log(formattedDate);
        // console.log(info.date.toLocaleDateString());

        // console.log(info.date.toUTCString());

        // console.log(info);
        // console.log(info.date.toLocaleDateString());
        // console.log(info.date);
        // router.push('/citas')
    };

    return (
        <div
            href="citas/nueva/01-01-2025"
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <span>{info.dayNumberText}</span>
            <CiSquarePlus
                style={{ fontSize: "1.5rem", cursor: "pointer" }}
                onClick={handleNuevaCita}
            />
        </div>
    );
};

const DayGridStyles = () => {
    return (
        <style>
            {`
              .fc-daygrid-day {
                // background-color:rgba(238, 144, 144, 0.5) !important; /* Set your desired background color */
                background-color:rgba(144, 238, 144, 0.5) !important; /* Set your desired background color */
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
