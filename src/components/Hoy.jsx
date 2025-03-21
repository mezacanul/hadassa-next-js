// app/components/Calendar.jsx
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import { Box, Stack } from "@chakra-ui/react";
import { LuBedSingle } from "react-icons/lu";

export default function Hoy() {
    const resources = [
        { id: "a1", title: "Hadassa", cama: 1, src: "lsh1.png" },
        { id: "a2", title: "Hadassa", cama: 2, src: "lsh1.png" },
        { id: "b1", title: "Aithana", cama: 1, src: "lsh2.png" },
        { id: "b2", title: "Aithana", cama: 2, src: "lsh2.png" },
        { id: "c1", title: "Eli", cama: 1, src: "lsh3.png" },
        { id: "c2", title: "Eli", cama: 2, src: "lsh3.png" },
    ];

    const events = [
        {
            title: "Sofia Rodriguez - Lash y Diseño",
            start: "2025-03-08T09:30:00",
            end: "2025-03-08T10:30:00",
            resourceId: "b1",
        },
        {
            title: "Karen Magaña - Lami",
            start: "2025-03-08T10:00:00",
            end: "2025-03-08T11:00:00",
            resourceId: "b2",
        },
        {
            title: "Ana Karen Palma - Lami",
            start: "2025-03-08T11:00:00",
            end: "2025-03-08T12:00:00",
            resourceId: "b1",
        },
        {
            title: "Patricia Palma - Brow Henna",
            start: "2025-03-08T12:00:00",
            end: "2025-03-08T12:30:00",
            resourceId: "b2",
        },
        {
            title: "Marian Rubio - Diseño",
            start: "2025-03-08T12:30:00",
            end: "2025-03-08T13:00:00",
            resourceId: "b1",
        },
        {
            title: "Katia Vazquez - Diseño",
            start: "2025-03-08T13:00:00",
            end: "2025-03-08T13:30:00",
            resourceId: "b2",
        },
        {
            title: "Dra. Fabiola Balam - Diseño",
            start: "2025-03-08T13:30:00",
            end: "2025-03-08T14:00:00",
            resourceId: "b1",
        },

        {
          title: "Mariana Pérez - Lash y Diseño",
          start: "2025-03-08T09:30:00",
          end: "2025-03-08T10:30:00",
          resourceId: "a1",
      },
      {
          title: "Camila Calderón - Lash y Diseño",
          start: "2025-03-08T10:30:00",
          end: "2025-03-08T11:30:00",
          resourceId: "a2",
      },
      {
          title: "Yarisa Fernandez - Lami",
          start: "2025-03-08T11:00:00",
          end: "2025-03-08T12:00:00",
          resourceId: "a1",
      },
      {
          title: "Paula Godinez - Diseño",
          start: "2025-03-08T12:00:00",
          end: "2025-03-08T12:30:00",
          resourceId: "a2",
      },
      {
          title: "Susan - Lami",
          start: "2025-03-08T14:00:00",
          end: "2025-03-08T15:00:00",
          resourceId: "a1",
      },
      {
          title: "Susana (Mamá) - Diseño",
          start: "2025-03-08T14:00:00",
          end: "2025-03-08T14:30:00",
          resourceId: "a2",
      },
      {
          title: "Yamileth (carcamo) - Lash y Lami",
          start: "2025-03-08T15:00:00",
          end: "2025-03-08T16:30:00",
          resourceId: "a2",
      },
      {
          title: "Nora Manzanilla - Lami",
          start: "2025-03-08T16:00:00",
          end: "2025-03-08T17:00:00",
          resourceId: "a1",
      },

      {
        title: "Montserrat Rosado - Lami",
        start: "2025-03-08T09:30:00",
        end: "2025-03-08T10:30:00",
        resourceId: "c1",
    },
    {
        title: "Fernanda Molina - Lami",
        start: "2025-03-08T10:00:00",
        end: "2025-03-08T11:00:00",
        resourceId: "c2",
    },
    {
      title: "Mitzi Molina - Lami",
      start: "2025-03-08T11:00:00",
      end: "2025-03-08T12:00:00",
      resourceId: "c1",
  },
    {
        title: "Ale Heredia - Lami",
        start: "2025-03-08T11:30:00",
        end: "2025-03-08T12:30:00",
        resourceId: "c2",
    },
    {
        title: "Ana Pao Mezo - Lami",
        start: "2025-03-08T12:30:00",
        end: "2025-03-08T13:30:00",
        resourceId: "c1",
    },
    {
        title: "Tita Hagar - Brow Henna",
        start: "2025-03-08T12:30:00",
        end: "2025-03-08T13:00:00",
        resourceId: "c2",
    },
    {
        title: "Andrea Palma - Lami",
        start: "2025-03-08T13:00:00",
        end: "2025-03-08T14:00:00",
        resourceId: "c2",
    },
    ];

    const renderResourceLabel = (info) => {
        return (
            <div
                style={{
                    padding: "8px",
                    textAlign: "center",
                }}
            >
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
                    <LuBedSingle style={{ fontSize: "1.4rem", color: "rgb(228, 129, 167)" }} />
                    <span
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: "bold",
                            marginLeft: "0.3rem",
                            color: "rgb(228, 129, 167)",
                        }}
                    >
                        - {info.resource.extendedProps.cama}
                    </span>
                </div>
            </div>
        );
    };

    return (
        <Box my="2rem">
            <style>
                {`
          .fc-timegrid-slots {
            background-color: rgb(255, 246, 248); /* Set your desired color */
          }
        `}
            </style>
            <FullCalendar
                plugins={[timeGridPlugin, resourceTimeGridPlugin]}
                initialView="resourceTimeGridDay"
                resources={resources}
                events={events}
                initialDate="2025-03-08"
                slotMinTime="09:00:00"
                slotMaxTime="18:00:00"
                expandRows={true}
                height="160vh"
                headerToolbar={{ left: "title", center: "", right: "" }}
                allDaySlot={false} // Removes the all-day row
                resourceLabelContent={renderResourceLabel}
            />
        </Box>
    );
}
