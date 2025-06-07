import { loadHook } from "@/utils/lattice-design";
import { Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Clienta() {
    const router = useRouter();
    const { clientaID } = router.query;
    const [loading, setLoading] = loadHook("useLoader");

    useEffect(()=>{
        setLoading(false)
    }, [])

    return (
        <div>
            <Heading>Hola Clienta {clientaID}</Heading>
        </div>
    );
}
