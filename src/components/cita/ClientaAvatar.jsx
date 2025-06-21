import { CDN } from "@/config/cdn";
import { useCita } from "@/pages/citas/[citaID]";
import { loadHook } from "@/utils/lattice-design";
import { Heading, Image, Text, VStack } from "@chakra-ui/react";
import { useRouter as useNextNav } from "next/navigation";

export default function ClientaAvatar() {
    const [loading, setLoading] = loadHook("useLoader")
    const NextNav = useNextNav();
    const [cita] = useCita();

    return (
        <VStack align={"start"} gap={"0"}>
            <Image
                shadow={"sm"}
                mb={"1.7rem"}
                rounded={"lg"}
                w={"10rem"}
                src={`${CDN}/img/clientas/${cita.foto_clienta || "avatar-woman.png"}`}
            />
            <Heading
                color={"pink.700"}
                _hover={{
                    textDecor: "underline",
                    cursor: "pointer"
                }}
                onClick={() => {
                    NextNav.push(`/clientas/${cita.clienta_id}`);
                    setLoading(true)
                }}
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
