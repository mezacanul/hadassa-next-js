import { Heading, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import FotosCejas from "../clienta/FotosCejas";
import DescripcionCejas from "../clienta/DescripcionCejas";

const lorem =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut augue tellus, viverra consectetur blandit ac, euismod in tortor. In a bibendum felis, at ultricies tortor. Morbi ac leo et enim semper aliquam id id augue. Quisque sagittis hendrerit accumsan. Cras varius semper vehicula. ";

// TO DO:
// Recibir los detalles de las cejas completos
// es decir:
//    - detallesCejas
//    - fotosCejas
export default function DetallesFaciales({
    clientaID,
    detalles,
}) {
    return (
        <VStack
            align={"start"}
            gap={"1.5rem"}
            w={"100%"}
        >
            <Heading size={"2xl"}>
                Fotos y Detalles:
            </Heading>
            <FotosCejas clientaID={clientaID} />

            <DescripcionCejas
                clientaID={clientaID}
                detalles={detalles}
            />
        </VStack>
    );
}
