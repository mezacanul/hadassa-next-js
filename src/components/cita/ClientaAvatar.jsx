import { CDN } from "@/config/cdn";
import { useCita } from "@/pages/citas/[citaID]";
import { Heading, Image, Text, VStack } from "@chakra-ui/react";

export default function ClientaAvatar() {
    const [cita] = useCita();

    return (
        <VStack align={"start"} gap={"0"}>
            <Image
                shadow={"sm"}
                mb={"1.7rem"}
                rounded={"full"}
                w={"10rem"}
                src={`${CDN}/img/clientas/${cita.foto_clienta || "avatar-woman.png"}`}
            />
            <Heading
                color={"pink.700"}
                // borderWidth={"0 0 2px"}
                borderColor={"pink.700"}
                size={"2xl"}
            >{`${cita.clienta_nombres} ${cita.clienta_apellidos}`}</Heading>
            <Text opacity={0.6} fontSize={"sm"}>
                +{`${cita.lada} ${cita.telefono}`}
            </Text>
        </VStack>
    );
}
