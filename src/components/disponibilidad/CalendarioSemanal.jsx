import {
    Grid,
    GridItem,
    VStack,
    HStack,
    Heading,
    Text,
    useToken,
} from "@chakra-ui/react";
import { Tooltip } from "../ui/tooltip";
import { useCurrentCita } from "@/pages/nueva-cita/[date]";

export default function CalendarioSemanal({
    agendaSemanal,
    goToAgendar,
}) {
    return (
        <VStack
            w={"100%"}
            my={"3rem"}
        >
            <Grid
                templateColumns="repeat(3, 1fr)"
                gap={"3rem"}
                gapY={"2rem"}
            >
                {agendaSemanal.map((dia) => (
                    <GridItem key={dia.fecha}>
                        <DiaYHoras
                            dia={dia}
                            goToAgendar={goToAgendar}
                        />
                    </GridItem>
                ))}
            </Grid>
        </VStack>
    );
}

function DiaYHoras({ dia, goToAgendar }) {
    return (
        <VStack>
            <Heading
                size={"md"}
                mb={"1rem"}
                textDecor={"underline"}
            >
                {dia.titulo}
            </Heading>
            {dia.disponibles.length == 0 && (
                <Text fontSize={"sm"}>
                    {"No hay horarios disponibles."}
                </Text>
            )}
            <Grid
                templateColumns="repeat(3, 1fr)"
                gap={"1rem"}
            >
                {dia.disponibles.length > 0 &&
                    dia.disponibles.map((disp, idx) => (
                        <GridItem key={idx}>
                            <HoraMiniCard
                                disp={disp}
                                goToAgendar={goToAgendar}
                            />
                        </GridItem>
                    ))}
            </Grid>
        </VStack>
    );
}

function HoraMiniCard({ disp, goToAgendar }) {
    const color = useToken("colors", "pink.600");
    const [currentCita, setCurrentCita] = useCurrentCita();

    return (
        <Tooltip content={"Agendar Cita"}>
            <VStack
                onClick={() => goToAgendar(disp)}
                bg={"white"}
                border={`2px solid ${color}`}
                px={"0.5rem"}
                py={"0.2rem"}
                rounded={"md"}
                transition={"all ease 0.3s"}
                _hover={{
                    cursor: "pointer",
                    transform: "scale(1.1)",
                }}
            >
                <Text
                    color={color}
                    fontWeight={700}
                >
                    {disp.hora}
                </Text>
            </VStack>
        </Tooltip>
    );
}
