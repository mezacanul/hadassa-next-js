import DetallesFaciales from "@/components/cita/DetallesFaciales";
import CitasTracker from "@/components/clienta/CitasTracker";
import ClientaForm from "@/components/clienta/ClientaForm";
import { loadHook } from "@/utils/lattice-design";
import {
    Box,
    Grid,
    Heading,
    Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Clienta() {
    const router = useRouter();
    const { clientaID } = router.query;
    const [loading, setLoading] = loadHook("useLoader");
    const [clienta, setClienta] = useState(null);
    const [citas, setCitas] = useState(null);

    useEffect(() => {
        if (router.isReady) {
            console.log("CID", clientaID);
            Promise.all([
                axios.get(`/api/clientas/${clientaID}`),
                axios.get(
                    `/api/citas?clienta=${clientaID}`
                ),
            ]).then(([clientaResp, citasResp]) => {
                console.log(clientaResp);
                setClienta(clientaResp.data[0]);
                setLoading(false);

                console.log(citasResp.data);
                setCitas(citasResp.data)
            });
        }
    }, [router.isReady]);

    return (
        <Grid gridTemplateColumns={"1fr 1fr"}>
            <Box w={"80%"}>
                {!clienta && (
                    <Spinner
                        borderWidth={"3px"}
                        size={"xl"}
                        color={"pink.500"}
                    />
                )}
                {clienta && (
                    <ClientaForm clienta={clienta} />
                )}
                {clienta && (
                    <DetallesFaciales
                        clientaID={clienta.id}
                        detalles={clienta.detalles_cejas}
                    />
                )}
            </Box>

            {citas && <CitasTracker citas={citas}/>}
        </Grid>
    );
}
