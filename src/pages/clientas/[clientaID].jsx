import DetallesCejas from "@/components/cita/DetallesCejas";
import { loadHook } from "@/utils/lattice-design";
import { Box, Grid, GridItem, Heading, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Clienta() {
    const router = useRouter();
    const { clientaID } = router.query;
    const [loading, setLoading] = loadHook("useLoader");
    const [clienta, setClienta] = useState(null);

    useEffect(() => {
        Promise.all([axios.get(`/api/clientas/${clientaID}`)]).then(
            ([clientaResp]) => {
                console.log(clientaResp);
                setClienta(clientaResp.data);
                setLoading(false);
            }
        );
    }, []);

    return (
        <Box w={"80%"}>
            <Heading>{clienta && clienta.nombres}</Heading>
            {clienta && <DetallesCejas data={clienta} />}
        </Box>
    );
}
