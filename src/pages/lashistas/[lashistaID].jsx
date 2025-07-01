import Eventos from "@/components/clienta/Eventos";
import FotoLashistaInput from "@/components/lashista/FotoLashistaInput";
import LashistaForm from "@/components/lashista/LashistaForm";
import { loadHook } from "@/utils/lattice-design";
import { capitalizeFirst } from "@/utils/main";
import { Badge, Grid, Heading, HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Lashista() {
    const router = useRouter();
    const { lashistaID } = router.query;
    const [loading, setLoading] = loadHook("useLoader");
    const [lashista, setLashista] = useState(null)
    const [title, setTitle] = useState("")

    useEffect(() => {
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
        <Grid w={"100%"} gridTemplateColumns={"1fr 1fr"} gap={"2rem"}>
            {!lashista && <Spinner size={"lg"} transform={"scale(1.2)"} color={"pink.500"} />}
            {lashista && (
                <VStack alignItems={"start"} w={"50%"}>
                    <LashistaTitle lashista={lashista} title={title} />
                    <FotoLashistaInput lashista={lashista} />
                    <LashistaForm lashista={lashista} />
                </VStack>
            )}

            <Eventos w={"100%"} lashistaID={lashistaID}/>
        </Grid>
    );
}

function LashistaTitle({ lashista, title }) {
    return (
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
    )
}