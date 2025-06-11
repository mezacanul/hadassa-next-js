import { loadHook } from "@/utils/lattice-design";
import { Grid, GridItem, Heading, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Clienta() {
    const router = useRouter();
    const { clientaID } = router.query;
    const [loading, setLoading] = loadHook("useLoader");
    const [clienta, setClienta] = useState(null);

    useEffect(() => {
        setLoading(false);
        Promise.all([axios.get(`/api/clientas/${clientaID}`)]).then(
            ([clientaResp]) => {
                console.log(clientaResp);
                setClienta(clientaResp.data);
            }
        );
    }, []);

    return <Heading>Clienta</Heading>;
}
