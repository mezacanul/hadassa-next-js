import { Box, Button, Heading, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SelectServicio from "@/components/NuevaCita/SelectServicio";
import SelectLashista from "@/components/NuevaCita/SelectLashista";
import SelectHorario from "@/components/NuevaCita/SelectHorario";
import SelectClienta from "@/components/NuevaCita/SelectClienta";

export default function NuevaCita() {
    const router = useRouter();
    const { date } = router.query;
    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
        if (router.isReady) {
          setCurrentDate(formatCurrentDate(date));
        }
      }, [router.isReady, date]);

    return (
        <Box mx={"3rem"} py={"3rem"} mb="3rem">
            {/* Titulo  */}
            <TituloAgendarCita fecha={currentDate} />

            {/* Lista de Opciones  */}
            <VStack gap={"4rem"}>
                {/* Opcion de Servicios  */}
                <SelectServicio />

                {/* Opcion de Lashistas  */}
                <SelectLashista />

                {/* Opcion de Horarios  */}
                <SelectHorario />

                {/* Opcion de Clienta  */}
                <SelectClienta />

                <Button
                    // disabled
                    fontSize={"xl"}
                    size={"xl"}
                    colorPalette={"pink"}
                >
                    Agendar Nueva Cita
                </Button>
            </VStack>
        </Box>
    );
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
        <VStack align={"start"} mb={"3rem"}>
            <Heading textDecor={"underline"} fontWeight={"300"} size={"3xl"}>
                Agendar Cita:
            </Heading>
            <Heading size={"5xl"} fontWeight={"light"} fontStyle={"italic"}>
                {fecha}
            </Heading>
        </VStack>
    );
}
