import { useEffect } from "react";
import { loadHook } from "@/utils/lattice-design";
import TablaClientas from "./TablaClientas";
import { Box, Grid } from "@chakra-ui/react";
import { useSearchTerm } from "@/pages/nueva-cita/[date]";
import NuevaClienta from "./NuevaClienta";

export function SelectClientas({
    clientasState,
    setClientasState,
    currentPaso,
    setCurrentPaso,
}) {
    const [searchTerm, setSearchTerm] = useSearchTerm();
    const [clientas] = loadHook("useClientas");

    useEffect(() => {
        return setSearchTerm("");
    }, []);

    return (
        <Box
            h={"100%"}
            w={"100%"}
            pb={"1rem"}
        >
            {clientas && clientasState == "buscar" && (
                <TablaClientas
                    clientas={clientas}
                    setCurrentPaso={setCurrentPaso}
                    searchTerm={searchTerm}
                />
            )}
            <Grid
                gridTemplateColumns={"repeat(2, 1fr)"}
                gap={"2rem"}
            >
                {clientasState == "nueva" && (
                    <NuevaClienta
                        setClientasState={setClientasState}
                        setCurrentPaso={setCurrentPaso}
                        currentPaso={currentPaso}
                    />
                )}
            </Grid>
        </Box>
    );
}
