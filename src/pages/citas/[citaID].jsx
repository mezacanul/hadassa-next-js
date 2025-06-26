import BrandLoader from "@/components/BrandLoader";
import AccionesTicket from "@/components/cita/AccionesTicket";
import ClientaAvatar from "@/components/cita/ClientaAvatar";
import DetallesFaciales from "@/components/cita/DetallesFaciales";
// import DetallesFaciales from "@/components/cita/DetallesFaciales";
import DetallesTicket from "@/components/cita/DetallesTicket";
import ImagenesTicket from "@/components/cita/ImagenesTicket";
import { loadHook, Singleton } from "@/utils/lattice-design";
import { Button, CloseButton, Dialog, Grid, GridItem, Heading, Portal, Skeleton, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Cita() {
    const router = useRouter();
    const { citaID } = router.query;
    const [cita, setCita] = useState();
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

    return (
        <Grid
            w={"100%"}
            gridTemplateColumns={"2fr 4fr"}
            gapX={"4rem"}
            minH={"70vh"}
        >
            <GridItem>{cita ? <DetallesCita cita={cita} setCita={setCita} /> : <BrandLoader />}</GridItem>

            <GridItem>{cita ? <DetallesClientaEnCita cita={cita} /> : <BrandLoader />}</GridItem>
        </Grid>
    );
}

function DetallesCita({ cita, setCita }) {
    return (
        <VStack gap={"3.5rem"}>
            <ImagenesTicket cita={cita} />
            <DetallesTicket cita={cita} />
            <AccionesTicket cita={cita} setCita={setCita} />
        </VStack >
    );
}

function DetallesClientaEnCita({ cita }) {
    return (
        <VStack gap={"2rem"} w={"100%"} align={"start"} ps={"2rem"}>
            <ClientaAvatar
                clientaID={cita.clienta_id}
                foto={cita.foto_clienta}
                nombres={cita.clienta_nombres}
                apellidos={cita.clienta_apellidos}
                lada={cita.lada}
                telefono={cita.telefono}
            />
            <DetallesFaciales
                clientaID={cita.clienta_id}
                detalles={cita.detalles_cejas}
            />
        </VStack>
    );
}
