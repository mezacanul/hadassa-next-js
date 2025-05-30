import { Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Clienta() {
    const router = useRouter();
    const { clientaID } = router.query;

    return (
        <div>
            <Heading>Hola Clienta ID</Heading>
        </div>
    );
}
