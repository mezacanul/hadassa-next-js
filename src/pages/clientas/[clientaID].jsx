import DetallesFaciales from "@/components/cita/DetallesFaciales";
import ClientaForm from "@/components/clienta/ClientaForm";
import { loadHook } from "@/utils/lattice-design";
import { Box, Spinner } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Clienta() {
    const router = useRouter();
    const { clientaID } = router.query;
    const [loading, setLoading] = loadHook("useLoader");
    const [clienta, setClienta] = useState(null);

    useEffect(() => {
        if (router.isReady) {
            console.log("CID", clientaID);
            Promise.all([axios.get(`/api/clientas/${clientaID}`)]).then(
                ([clientaResp]) => {
                    console.log(clientaResp);
                    setClienta(clientaResp.data[0]);
                    setLoading(false);
                }
            );
        }
    }, [router.isReady]);

    return (
        <Box w={"80%"}>
            {!clienta && <Spinner borderWidth={"3px"} size={"xl"} color={"pink.500"} />}
            {clienta && <ClientaForm clienta={clienta}/>}
            {clienta && <DetallesFaciales clientaID={clienta.id} detalles={clienta.detalles_cejas}/>}
        </Box>
    );
}