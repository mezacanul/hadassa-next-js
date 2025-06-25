import { CDN } from "@/config/cdn";
import { useCurrentCita } from "@/pages/nueva-cita/[date]";
import { Box, Button, Card, HStack, Image, Text, VStack } from "@chakra-ui/react";

export default function LashistaCard({ data }) {
    const [currentCita, setCurrentCita] = useCurrentCita();
    const horariosLV = JSON.parse(data.horarioLV);

    return (
        <Card.Root flexDir={"row"} overflow="hidden" size="sm" shadow={"md"}>
            {/* <HStack px={"2rem"} py={"1rem"} pt={"1.5rem"}> */}
            <VStack gap={"1rem"} w={"100%"} py={"1.5rem"}>
                <Image
                    objectFit="cover"
                    maxW="6.8rem"
                    // maxH={"10rem"}
                    src={`${CDN}/img/lashistas/${data.image}`}
                    alt="Caffe Latte"
                />
                <Card.Title fontSize={"1.2rem"} mb={"0"}>
                    {data.nombre}
                </Card.Title>

                <Button
                    shadow={"sm"}
                    size={"sm"}
                    bg={"pink.500"}
                    onClick={() => {
                        setCurrentCita({ ...currentCita, lashista: data });
                    }}
                >
                    Seleccionar
                </Button>
            </VStack>

            {/* <Card.Body>
                    <VStack alignItems={"start"} gap={"1rem"}>
                        <VStack alignItems={"start"}>
                            <Card.Description>Horario L-V</Card.Description>
                            <VStack>
                                {horariosLV.map((hlv) => {
                                    return <Text key={hlv}>{hlv}</Text>;
                                })}
                            </VStack>
                        </VStack>

                        <VStack alignItems={"start"}>
                            <Card.Description>Sábado</Card.Description>
                            <Text>{data.horarioSBD}</Text>
                        </VStack>
                    </VStack>
                </Card.Body> */}
            {/* </HStack> */}
        </Card.Root>
    );
}