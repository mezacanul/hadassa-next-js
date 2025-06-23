import { CDN } from "@/config/cdn";
import { useCita } from "@/pages/citas/[citaID]";
import { loadHook } from "@/utils/lattice-design";
import { formatCamaID } from "@/utils/main";
import { Heading, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { useRouter as useNextNav } from "next/navigation";
import { useEffect } from "react";

export default function ImagenesTicket({ cita }) {
    const [loading, setLoading] = loadHook("useLoader")
    const NextNav = useNextNav();
    // const [cita] = useCita();

    useEffect(()=>{
        console.log(cita);
    }, [])

    return (
        <VStack w={"100%"} gap={"2rem"} align={"start"}>
            <HStack w={"100%"} gap={"2rem"} justifyContent={"space-between"}>
                <Image
                    shadow={"sm"}
                    rounded={"md"}
                    w={"10rem"}
                    src={`${CDN}/img/servicios/${cita.servicio_foto}`}
                />
                <Lashista
                    nombre={cita.lashista}
                    foto={cita.lashista_foto}
                    camaID={cita.cama_id}
                />
            </HStack>

            <Heading
                onClick={() => {
                    setLoading(true)
                    NextNav.push(`/servicios/${cita.servicio_id}`)
                }}
                _hover={{
                    textDecor: "underline",
                    cursor: "pointer"
                }}
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

function Lashista({ foto, nombre, camaID }) {
    // const [cita] = useCita();

    return (
        <VStack w={"100%"} alignItems={"end"}>
            <Image
                shadow={"sm"}
                rounded={"full"}
                w={"5rem"}
                src={`${CDN}/img/lashistas/${foto}`}
            />
            <VStack align={"end"} ms={"1rem"}>
                <Text fontWeight={700}>{nombre}</Text>
                <Text>{formatCamaID(camaID)}</Text>
            </VStack>
        </VStack>
    );
}