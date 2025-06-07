import { Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Servicio() {
    const router = useRouter();
    const { servicioID } = router.query;

    return (
        <div>
            <Heading>Hola Servicio ID</Heading>
        </div>
    );
}
