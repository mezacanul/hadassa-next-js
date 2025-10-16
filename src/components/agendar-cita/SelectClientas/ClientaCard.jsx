import { Card, Image, Box, Badge } from "@chakra-ui/react";
import { CDN } from "@/config/cdn";

export function ClientaCard({ data, currentPaso }) {
    return (
        <Card.Root
            bg={"white"}
            shadow={"lg"}
            flexDirection="row"
            overflow="hidden"
            maxW="xl"
        >
            <Image
                objectFit="cover"
                w={"8rem"}
                src={
                    data.foto_clienta
                        ? `${CDN}/img/clientas/${data.foto_clienta}`
                        : `${CDN}/img/clientas/avatar-woman.png`
                }
                alt=""
            />
            <Box>
                <Card.Body>
                    <Card.Title mb="2">
                        {data.nombres || data.apellidos
                            ? `${data.nombres} ${data.apellidos}`
                            : "--"}
                    </Card.Title>
                    <Card.Description>
                        {data.lada || data.telefono
                            ? `+${data.lada} ${data.telefono}`
                            : "--"}
                    </Card.Description>
                </Card.Body>
                <Card.Footer>
                    {currentPaso != "Lista" && !data.id && (
                        <Badge colorPalette={"green"}>
                            Nueva Clienta
                        </Badge>
                    )}
                </Card.Footer>
            </Box>
        </Card.Root>
    );
}
