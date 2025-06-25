import FotoLashistaInput from "@/components/lashista/FotoLashistaInput";
import LashistaForm from "@/components/lashista/LashistaForm";
import { loadHook } from "@/utils/lattice-design";
import { capitalizeFirst } from "@/utils/main";
import { Badge, Heading, Spinner, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Servicio() {
    const router = useRouter();
    const { lashistaID } = router.query;
    const [loading, setLoading] = loadHook("useLoader");
    const [lashista, setLashista] = useState(null)
    const [title, setTitle] = useState("")

    useEffect(()=>{
        return (setLashista(null))
    }, [])

    useEffect(() => {
        if (router.isReady) {
            axios.get(`/api/lashistas/${lashistaID}`)
                .then((axiosResp) => {
                    console.log(axiosResp);
                    setLashista(axiosResp.data)
                    setTitle(axiosResp.data.nombre)
                    setLoading(false)
                })
        }
    }, [router.isReady])

    return (
        <VStack alignItems={"start"} w={"100%"}>
            {!lashista && <Spinner size={"lg"} transform={"scale(1.2)"} color={"pink.500"}/>}
            <VStack alignItems={"start"} mb={"1rem"} gap={"0.5rem"}>
                <Heading size={"4xl"} color={"pink.500"}>{title}</Heading>
                {lashista && (
                    <Badge
                        px={3}
                        fontSize={"0.8rem"}
                        shadow={"sm"}
                        fontWeight={600}
                        colorPalette={"purple"}
                    >
                        {capitalizeFirst(lashista.rol)}
                    </Badge>
                )}
            </VStack>
            {lashista && <FotoLashistaInput lashista={lashista} />}
            {lashista && <LashistaForm lashista={lashista} />}
        </VStack>
    );
}
