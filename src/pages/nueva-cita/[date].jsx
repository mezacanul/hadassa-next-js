import ListaServicios from "@/components/ListaServicios";
import { Box, Button, Grid, GridItem, Heading, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function NuevaCita() {
    const router = useRouter();
    const { date } = router.query;
    const [showServicios, setShowServicios] = useState(true);
    const [showLashistas, setShowLashistas] = useState(false);
    const [showHorarios, setShowHorarios] = useState(false);

    return (
        <Box p={"2rem"}>
            <VStack>
                <Heading size={"5xl"} >
                    Agendar Cita
                </Heading>
                <Heading
                    textDecor={"underline"}
                    size={"2xl"}
                    fontWeight={"light"}
                >
                    {date}
                </Heading>
            </VStack>

            <VStack align={"start"} templateRows={"repeat(3, 1fr)"} py={"1.5rem"}>
                <Box>
                    <Heading mb={"1rem"} size={"5xl"} color={"pink.600"}>
                        Servicio
                    </Heading>
                    {showServicios && (
                        <ListaServicios setShowServicios={setShowServicios} />
                    )}
                </Box>
                <VStack>
                    <Heading mb={"1rem"} size={"5xl"} color={"pink.600"}>
                        Lashista
                    </Heading>
                    {/* <ListaServicios /> */}
                </VStack>
                <VStack>
                    <Heading mb={"1rem"} size={"5xl"} color={"pink.600"}>
                        Horario
                    </Heading>
                    {/* <ListaServicios /> */}
                </VStack>
                <Button fontSize={"xl"} size={"xl"} colorPalette={"pink"}>
                    Agendar Nueva Cita
                </Button>
            </VStack>
        </Box>
    );
}
