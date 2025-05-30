import { Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Servicio() {
    const router = useRouter();
    const { lashistaID } = router.query;

    return (
        <div>
            <Heading>Hola Lashista ID</Heading>
        </div>
    );
}
