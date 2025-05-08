import { Box, Button, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SelectServicio, {
    CurrentServicio,
} from "@/components/NuevaCita/SelectServicio";
import SelectLashista, {
    CurrentLashista,
} from "@/components/NuevaCita/SelectLashista";
import SelectHorario, {
    CurrentHorario,
} from "@/components/NuevaCita/SelectHorario";
import SelectClienta, {
    CurrentClienta,
} from "@/components/NuevaCita/SelectClienta";
import { FaRegClock } from "react-icons/fa";
import { BiReceipt } from "react-icons/bi";
import { BsCalendar2Date } from "react-icons/bs";
import { loadHook, Singleton } from "@/utils/lattice-design";
import { LuBedSingle } from "react-icons/lu";
import { formatHoyTitle } from "@/utils/main";
import axios from "axios";
import { parse, format } from "date-fns";
import { es } from "date-fns/locale";

export const useCurrentCita = Singleton({
    servicio: null,
    lashista: null,
    horario: null,
    clienta: null,
    fecha: null,
});

// export const useCurrentCita = Singleton(null)

export default function NuevaCita() {
    const [DOM, setDOM] = loadHook("useDOM");
    const router = useRouter();
    const { date } = router.query;
    const [currentDate, setCurrentDate] = useState("");
    const [currentCita, setCurrentCita] = useCurrentCita();
    const [selectedDate, setSelectedDate] = loadHook("useSelectedDate");

    useEffect(() => {
        setDOM({ title: "Agendar Cita" });

        return () => {
            useCurrentCita.reset();
        };
    }, []);

    useEffect(() => {
        if (router.isReady) {
            setCurrentDate(formatCurrentDate(date));
            setCurrentCita({ ...currentCita, fecha: formatCurrentDate(date) });
            if (selectedDate == null) {
                const [day, month, year] = date.split("-");
                const formattedDate = `${year}-${month}-${day}`;
                setSelectedDate(formattedDate);
            }
        }
    }, [router.isReady, date]);

    return (
        <Box w={"100%"} mb={"2rem"}>
            <Heading
                mt={"1rem"}
                textAlign={"center"}
                fontWeight={300}
                size={"4xl"}
            >
                Agendar Cita
            </Heading>
            {/* Titulo  */}
            {/* <TituloAgendarCita fecha={currentDate} /> */}

            {currentCita.servicio != null &&
                currentCita.lashista != null &&
                currentCita.horario != null && <SelectClienta />}

            <SelectServicio />
            <SelectedOptions />
        </Box>
    );
}

function SelectedOptions() {
    const [currentCita, setCurrentCita] = useCurrentCita();

    useEffect(() => {
        console.log("current cita", currentCita);
    }, [currentCita]);

    if (
        currentCita.servicio != null ||
        currentCita.lashista != null
        // currentCita.horario != null
    ) {
        return (
            <VStack mt={"2rem"} rowGap={"2rem"} align={"start"}>
                <HStack gapX={"2rem"} h={"35vh"} w={"100%"} justify={"start"}>
                    <CurrentServicio />

                    <SelectLashista />
                    <CurrentLashista />

                    <SelectHorario />
                    {/* <CurrentHorario /> */}
                </HStack>

                {currentCita.clienta != null && <ResumenCita />}
            </VStack>
        );
    }
}

function ResumenCita() {
    const [currentCita, setCurrentCita] = useCurrentCita();
    
    function ConfirmarDetalles(){
        const monthMap = {
            enero: "01",
            febrero: "02",
            marzo: "03",
            abril: "04",
            mayo: "05",
            junio: "06",
            julio: "07",
            agosto: "08",
            septiembre: "09",
            octubre: "10",
            noviembre: "11",
            diciembre: "12",
        };
        const [day, , month, , year] = currentCita.fecha
            .toLowerCase()
            .split(" ");
        const formattedFecha = `${day}-${monthMap[month]}-${year}`;

        const [time, period] = currentCita.horario.split(" ")
        const [hourStr, minuteStr] = time.split(":")

        // console.log(hourStr, minuteStr, period)
        const formattedHora = `${hourStr}:${minuteStr}`;
        // console.log(formattedHora);

        const send = {
            clienta_id: currentCita.clienta.id,
            servicio_id: currentCita.servicio.id,
            lashista_id: currentCita.lashista.id,
            fecha: formattedFecha,
            hora: formattedHora,
            cama_id: "cama-hadassa-1",
        };
        // console.log(send);
        // return
        
        axios.post("/api/citas", send).then((citasResp) => {
            console.log(citasResp.data);
        });
    }

    return (
        <HStack
            gapX={"2rem"}
            h={"33vh"}
            justify={"space-between"}
            // w={"67rem"}
            w={"98%"}
            align={"flex-end"}
        >
            <CurrentClienta />

            <VStack align={"end"} justify={"space-between"} h={"100%"}>
                <VStack rowGap={"0.5rem"} align={"end"}>
                    <Heading fontSize={"2xl"} color={"pink.700"}>
                        {currentCita.servicio.servicio}
                    </Heading>
                    <HStack gap={"1rem"}>
                        <Text>{currentCita.fecha}</Text>
                        <BsCalendar2Date />
                    </HStack>
                    <HStack gap={"1rem"}>
                        <Text>{`${currentCita.clienta.nombre_completo}`}</Text>
                        <BiReceipt />
                    </HStack>
                    <HStack gap={"1rem"}>
                        <Text>{currentCita.horario}</Text>
                        <FaRegClock />
                    </HStack>
                    <HStack gap={"1rem"}>
                        <Text> {currentCita.lashista.nombre}</Text>
                        <LuBedSingle />
                    </HStack>
                </VStack>
                <Button
                    onClick={ConfirmarDetalles}
                    // disabled
                    fontSize={"xl"}
                    size={"xl"}
                    colorPalette={"pink"}
                >
                    Confirmar Detalles
                </Button>
            </VStack>
        </HStack>
    );
}

function formatCurrentDate(date) {
    // const { date } = router.query;
    const [day, month, year] = date.split("-");
    const USDate = new Date(`${month}-${day}-${year}`);
    // console.log(USDate);
    const formattedDate = USDate.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    return formattedDate;
}

function TituloAgendarCita({ fecha }) {
    const [selectedDate] = loadHook("useSelectedDate");

    return (
        <VStack align={"start"} mb={"2rem"}>
            <Heading textDecor={"underline"} fontWeight={"300"} size={"3xl"}>
                Agendar Cita:
            </Heading>
            <Heading size={"5xl"} fontWeight={"light"} fontStyle={"italic"}>
                {formatHoyTitle(selectedDate)}
            </Heading>
        </VStack>
    );
}
