import {
    Box,
    Button,
    Grid,
    Heading,
    Image,
    Text,
    VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { RiCloseLargeLine } from "react-icons/ri";

import { Singleton } from "@/utils/lattice-design";
import { useCurrentCita } from "@/pages/nueva-cita/[date]";
import RemoveButton from "../common/RemoveButton";

const useLashistas = Singleton(null);

export default function SelectLashista() {
    const [currentCita] = useCurrentCita();

    if (currentCita.lashista == null) {
        return (
            <>
            {/* // <VStack w={"100%"}> */}
                {/* <Heading
                    mb={"2.5rem"}
                    fontWeight={"300"}
                    size={"5xl"}
                    color={"pink.600"}
                >
                    Lashista
                </Heading> */}

                <ListaLashistas />
            {/* // </VStack> */}
            </>
        );
    }
}

export function CurrentLashista() {
    const [currentCita, setCurrentCita] = useCurrentCita();

    if (currentCita.lashista != null) {
        return (
            <VStack
                h={"100%"}
                align={"center"}
                justify={"center"}
                // w={"100%"}
                px={"4rem"}
                py={"2rem"}
                bg={"pink.600"}
                gap={"0.5rem"}
                boxShadow={"0px 6px 7px rgba(136, 136, 136, 0.4)"}
                rounded={"xl"}
                color={"white"}
                position={"relative"}
            >
                {/* CLose Button  */}
                <RemoveButton
                    onClick={() => {
                        setCurrentCita({ ...currentCita, lashista: null });
                    }}
                />

                <Text mb={"0.5rem"}>Lashista:</Text>
                <Image
                    // me={"1rem"}
                    boxShadow={"-4px 4px 8px rgba(0,0,0,0.2)"}
                    borderRadius={"100%"}
                    objectFit={"cover"}
                    w={"7rem"}
                    mb={"0.5rem"}
                    src={`/img/lashistas/${currentCita.lashista.image}`}
                />
                <Heading size={"xl"}>{currentCita.lashista.nombre}</Heading>
            </VStack>
        );
    }
}

function ListaLashistas() {
    const [lashistas, setLashistas] = useLashistas();

    useEffect(() => {
        Promise.all([axios.get("/api/lashistas")]).then(([LashistaResp]) => {
            setLashistas(LashistaResp.data);
            // console.log("DB data:", LashistaResp.data);
        });
    }, []);

    if (lashistas != null) {
        return (
            <VStack
            h={"100%"}
                w={"45rem"}
                borderRadius={"2rem"}
                borderColor={"pink.500"}
                borderWidth={"1px"}
                // p={"2rem"}
                px={"0.5rem"}
                pb={"2rem"}
                pt={"1rem"}
            >
                <Text color={"pink.700"} mb={"1rem"}>Seleccionar Lashista</Text>
                <Grid templateColumns={"repeat(3, 1fr)"} w={"100%"}>
                    {lashistas.map((lsh) => {
                        return <Lashista key={lsh.id} data={lsh} />;
                    }, [])}
                </Grid>
            </VStack>
        );
    }
}

function Lashista({ data }) {
    const [currentCita, setCurrentCita] = useCurrentCita();

    function handleSelectLashista(e) {
        setCurrentCita({ ...currentCita, lashista: data });
    }

    return (
        <VStack align={"center"} w={"100%"} gap={"2rem"}>
            <Image
                // me={"1rem"}
                boxShadow={"-4px 4px 8px rgba(0,0,0,0.2)"}
                borderRadius={"100%"}
                objectFit={"cover"}
                w={"7rem"}
                src={`/img/lashistas/${data.image}`}
            />
            <Button
                fontSize={"lg"}
                size={"lg"}
                // bg={"pink.500"}
                colorPalette={"pink"}
                onClick={handleSelectLashista}
            >
                {data.nombre}
            </Button>
        </VStack>
    );
}
