import {
  Box,
  Link,
  // Button,
  // Heading,
  // HStack,
  // Image,
  // Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

function renderEventContent(eventInfo) {
  let color = eventInfo.event.title == "Disponible" ? "#198754" : "#6c757d"
  return (
    <Box bg={color} p={"0.2rem"}>
      <Text>{eventInfo.event.title}</Text>
    </Box>
  );
}

export default function CalendarioMes() {
  const handleDayClick = (info)=>{
    console.log(info.dayNumberText);
    
  }
  return (
    <VStack py="1rem" px="2rem">
      <Box width="100%">
        <style>
            {`
              .fc-daygrid-day {
                // background-color:rgba(238, 144, 144, 0.5) !important; /* Set your desired background color */
                background-color:rgba(144, 238, 144, 0.5) !important; /* Set your desired background color */
              }
            `}
        </style>
        <FullCalendar
          height="60vh"
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          weekends={true}
          hiddenDays={[0]}
          // events={events}
          eventContent={renderEventContent}
          // selectable={true}
          dayCellDidMount={(info) => {
            info.el.addEventListener("click", () => {
              handleDayClick(info)
            });
          }}
        />
      </Box>
      
      <VStack fontSize={"1.5rem"} h={"30vh"} w={"100%"} align={"end"} justify={"space-evenly"}>
        <Link>Citas</Link>
        <Link>Clientas</Link>
        <Link>Servicios</Link>
        <Link>Lashistas</Link>
      </VStack>
    </VStack>
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
  { title: "Disponible", start: "2025-03-20"},
  { title: "Disponible", start: "2025-03-21"},

  { title: "Disponible", start: "2025-03-24" },
  { title: "Lleno", start: "2025-03-25" },
  { title: "Disponible", start: "2025-03-26" },
  { title: "Disponible", start: "2025-03-27" },
  { title: "Lleno", start: "2025-03-28" },
  
  { title: "Disponible", start: "2025-03-31" },
];
