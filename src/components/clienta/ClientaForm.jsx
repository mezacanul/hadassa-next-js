import { Heading, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import FotoPerfilInput from "./FotoPerfilInput";
import DatosForm from "./DatosForm";

export default function ClientaForm({ clienta }) {
    const [fullNombre, setFullNombre] = useState(
        `${clienta.nombres} ${clienta.apellidos}`
    );

    useEffect(() => {
        console.log(clienta);
    }, [clienta]);

    return (
        <VStack
            alignItems={"start"}
            gap={"1rem"}
            mb={"2rem"}
        >
            <Heading
                color={"pink.600"}
                mb={"1rem"}
                size={"3xl"}
            >{`${fullNombre}`}</Heading>
            <FotoPerfilInput clienta={clienta} />
            <DatosForm
                clienta={clienta}
                setFullNombre={setFullNombre}
            />
        </VStack>
    );
}
