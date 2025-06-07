import { Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Citas() {
    const router = useRouter();
    const { citaID } = router.query;

    return (
        <div>
            <Heading>Hola Cita ID</Heading>
        </div>
    );
}
