import { CDN } from "@/config/cdn";
import {
    HStack,
    Heading,
    Image,
    Text,
    VStack,
} from "@chakra-ui/react";

export default function ParamsViewer({
    servicio,
    lashista,
}) {
    return (
        <VStack
            w={"100%"}
            justifyContent={"start"}
            alignItems={"center"}
            my={"1.5rem"}
            gap={"2rem"}
        >
            <HStack
                w={"25rem"}
                justifyContent={"space-between"}
                // gap={"2rem"}
            >
                <ServicioAvatar servicio={servicio} />
                <LashistaAvatar lashista={lashista} />
            </HStack>
        </VStack>
    );
}

function LashistaAvatar({ lashista }) {
    return (
        <VStack>
            <Image
                src={`${CDN}/img/lashistas/${lashista.image}`}
                w={"3.5rem"}
                h={"3.5rem"}
                rounded={"full"}
                objectFit={"cover"}
            />
            <Text
                fontWeight={600}
                color={"pink.600"}
            >
                {lashista.nombre}
            </Text>
        </VStack>
    );
}

function ServicioAvatar({ servicio }) {
    return (
        <HStack
            alignItems={"center"}
            gap={"1rem"}
        >
            <Image
                src={`${CDN}/img/servicios/${servicio.image}`}
                w={"5rem"}
                h={"5rem"}
                rounded={"sm"}
                objectFit={"cover"}
            />
            <Heading
                maxW={"10rem"}
                // textAlign={"center"}
            >
                {servicio.servicio}
            </Heading>
        </HStack>
    );
}
