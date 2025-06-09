import { useCita } from "@/pages/citas/[citaID]";
import { Heading, HStack, Image, Text, VStack } from "@chakra-ui/react";

export default function ImagenesTicket() {
    const [cita] = useCita();

    return (
        <VStack w={"100%"} gap={"2rem"} align={"start"}>
            <HStack w={"100%"} gap={"2rem"} justifyContent={"space-between"}>
                <Image
                    shadow={"sm"}
                    rounded={"md"}
                    w={"10rem"}
                    src={`/img/servicios/${cita.servicio_foto}`}
                />
                <Lashista />
            </HStack>
            <Heading
                color={"pink.700"}
                // borderWidth={"0 0 2px"}
                borderColor={"pink.700"}
                size={"2xl"}
            >
                {cita.servicio}
            </Heading>
        </VStack>
    );
}

function Lashista() {
    const [cita] = useCita();

    return (
        <HStack w={"100%"} justifyContent={"end"}>
            <Image
                shadow={"sm"}
                rounded={"full"}
                w={"5rem"}
                src={`/img/lashistas/${cita.lashista_foto}`}
            />
            <VStack align={"end"} ms={"1rem"}>
                <Text fontWeight={700}>{cita.lashista}</Text>
                <Text>{formatCamaID(cita.cama_id)}</Text>
            </VStack>
        </HStack>
    );
}

function formatCamaID(camaID) {
    console.log(camaID.split("-"));

    const camaArray = camaID.split("-");
    return `${capitalizeFirst(camaArray[0])} ${camaArray[2]}`;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
