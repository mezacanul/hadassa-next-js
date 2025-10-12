import {
    Grid,
    GridItem,
    VStack,
    HStack,
    Heading,
    Text,
    useToken,
} from "@chakra-ui/react";

export default function CalendarioSemanal({
    agendaSemanal,
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
                        <DiaYHoras dia={dia} />
                    </GridItem>
                ))}
            </Grid>
        </VStack>
    );
}

function DiaYHoras({ dia }) {
    return (
        <VStack>
            <Heading>{dia.titulo}</Heading>
            <Grid
                templateColumns="repeat(4, 1fr)"
                gap={"1rem"}
            >
                {dia.disponibles.map((disp, idx) => (
                    <GridItem key={idx}>
                        <HoraMiniCard hora={disp.hora} />
                    </GridItem>
                ))}
            </Grid>
        </VStack>
    );
}

function HoraMiniCard({ hora }) {
    const color = useToken("colors", "pink.600");
    return (
        <VStack
            bg={"white"}
            border={`2px solid ${color}`}
            px={"0.5rem"}
            py={"0.2rem"}
            rounded={"md"}
        >
            <Text
                color={color}
                fontWeight={700}
            >
                {hora}
            </Text>
        </VStack>
    );
}
