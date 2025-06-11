import { useEffect, useState } from "react";
import { ActionsClienta, SelectClientas } from "../nueva-cita/[date]";
import { Box } from "@chakra-ui/react";
import { loadHook } from "@/utils/lattice-design";

export default function Clientas() {
    const [clientasState, setClientasState] = useState("buscar");
    const [currentPaso, setCurrentPaso] = useState("Lista");
    const [loading, setLoading] = loadHook("useLoader")

    useEffect(()=>{
        setLoading(false)
    }, [])

    return (
        <Box py={"2rem"} w={"80%"}>
            <ActionsClienta
                clientasState={clientasState}
                setClientasState={setClientasState}
                currentPaso={currentPaso}
            />
            <SelectClientas
                clientasState={clientasState}
                setClientasState={setClientasState}
                currentPaso={currentPaso}
                setCurrentPaso={setCurrentPaso}
            />
        </Box>
    );
}
