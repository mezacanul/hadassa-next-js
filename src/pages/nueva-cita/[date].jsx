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



import { loadHook, MiniSingleton } from "@/utils/lattice-design";
import { LuBedSingle } from "react-icons/lu";

export const useCurrentCita = MiniSingleton({
    servicio: null,
    lashista: null,
    horario: null,
    clienta: null,
    fecha: null
});

// export const useCurrentCita = MiniSingleton(null)

export default function NuevaCita() {
    const [DOM, setDOM] = loadHook("useDOM");
    const router = useRouter();
    const { date } = router.query;
    const [currentDate, setCurrentDate] = useState("");
    const [currentCita, setCurrentCita] = useCurrentCita();

    useEffect(() => {
        setDOM({ title: "Agendar Cita" });

        return () => {
            useCurrentCita.reset();
        };
    }, []);

    useEffect(() => {
        if (router.isReady) {
            setCurrentDate(formatCurrentDate(date));
            setCurrentCita({...currentCita, fecha: formatCurrentDate(date)})
        }
    }, [router.isReady, date]);

    return (
        <Box mx={"3rem"} py={"3rem"}>
            {/* Titulo  */}
            <TituloAgendarCita fecha={currentDate} />

            <SelectedOptions />

            {currentCita.servicio != null &&
                currentCita.lashista != null &&
                currentCita.horario != null && <SelectClienta />}

            {/* Lista de Opciones  */}
            <VStack align={"center"} w={"100%"}>
                <VStack gap={"4rem"} w={"70%"}>
                    {/* Opcion de Servicios  */}
                    <SelectServicio />

                    {/* Opcion de Lashistas  */}
                    {/* {currentCita.servicio != null && <SelectLashista />} */}

                    {/* Opcion de Horarios  */}
                    {/* <SelectHorario /> */}

                    {/* Opcion de Clienta  */}
                </VStack>
            </VStack>
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
            <VStack mt={"3rem"} rowGap={"2rem"} align={"start"}>
                <HStack gapX={"2rem"} h={"33vh"} w={"100%"} justify={"start"}>
                    <CurrentServicio />
                    <CurrentLashista />

                    <SelectLashista />

                    <SelectHorario />
                    {/* <CurrentHorario /> */}
                </HStack>

                {currentCita.clienta != null && (
                    <HStack
                        gapX={"2rem"}
                        h={"33vh"}
                        justify={"space-between"}
                        w={"67rem"}
                        align={"flex-end"}
                    >
                        <CurrentClienta />

                        <VStack
                            align={"end"}
                            justify={"space-between"}
                            h={"100%"}
                        >
                            <VStack rowGap={"1rem"} align={"end"} pt={"1rem"}>
                                <Heading fontSize={"2xl"} color={"pink.700"}>
                                    {currentCita.servicio.servicio}
                                </Heading>
                                <HStack gap={"1rem"}>
                                    <Text>{currentCita.fecha}</Text>
                                    <BsCalendar2Date />
                                </HStack>
                                <HStack gap={"1rem"}>
                                    <Text>{`${currentCita.clienta.segundo_nombre} ${currentCita.clienta.apellido_paterno}`}</Text>
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
                                // disabled
                                fontSize={"xl"}
                                size={"xl"}
                                colorPalette={"pink"}
                            >
                                Confirmar Detalles
                            </Button>
                        </VStack>
                    </HStack>
                )}
            </VStack>
        );
    }
}

function formatCurrentDate(date) {
    // const { date } = router.query;
    const [day, month, year] = date.split("-");
    const USDate = new Date(`${month}-${day}-${year}`);
    console.log(USDate);
    const formattedDate = USDate.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    return formattedDate;
}

function TituloAgendarCita({ fecha }) {
    return (
        <VStack align={"start"} mb={"2rem"}>
            <Heading textDecor={"underline"} fontWeight={"300"} size={"3xl"}>
                Agendar Cita:
            </Heading>
            <Heading size={"5xl"} fontWeight={"light"} fontStyle={"italic"}>
                {fecha}
            </Heading>
        </VStack>
    );
}
