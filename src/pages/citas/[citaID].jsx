import BrandLoader from "@/components/BrandLoader";
import AccionesTicket from "@/components/cita/AccionesTicket";
import ClientaAvatar from "@/components/cita/ClientaAvatar";
import DetallesCejas from "@/components/cita/DetallesCejas";
import DetallesTicket from "@/components/cita/DetallesTicket";
import ImagenesTicket from "@/components/cita/ImagenesTicket";
import { loadHook, Singleton } from "@/utils/lattice-design";
import { Grid, GridItem, Heading, Skeleton, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const useCita = Singleton(null);

export default function Citas() {
    const router = useRouter();
    const { citaID } = router.query;
    const [cita, setCita] = useCita();
    const [loading, setLoading] = loadHook("useLoader");

    useEffect(() => {
        if (citaID) {
            axios.get(`/api/citas?id=${citaID}`).then((citaResp) => {
                // console.log("citaRESP", citaResp.data);
                setCita(citaResp.data);
                setLoading(false);
            });
        }
    }, [router.isReady, citaID]);

    // useEffect(()=>{
    //     return (
    //         setCita(null)
    //     )
    // }, [])

    return (
        <Grid
            w={"100%"}
            gridTemplateColumns={"2fr 4fr"}
            gapX={"4rem"}
            minH={"70vh"}
        >
            <GridItem>{cita ? <DetallesCita /> : <BrandLoader />}</GridItem>

            <GridItem>{cita ? <DetallesClienta clientaID={cita.clienta_id}/> : <BrandLoader />}</GridItem>
        </Grid>
    );
}

function DetallesCita() {
    return (
        <VStack gap={"3.5rem"}>
            <ImagenesTicket />
            <DetallesTicket />
            <AccionesTicket />
        </VStack>
    );
}

function DetallesClienta({clientaID}) {
    return (
        <VStack gap={"2rem"} w={"100%"} align={"start"} ps={"2rem"}>
            <ClientaAvatar />
            <DetallesCejas clientaID={clientaID}/>
        </VStack>
    );
}
