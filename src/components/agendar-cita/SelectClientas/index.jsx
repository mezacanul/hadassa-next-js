import { useEffect, useState } from "react";
import { loadHook } from "@/utils/lattice-design";
import TablaClientas from "./TablaClientas";
import { Box, Grid } from "@chakra-ui/react";
import { useSearchTerm } from "@/pages/nueva-cita/[date]";
import NuevaClienta from "./NuevaClienta";
import AlertDuplicateClienta from "./AlertDuplicateClienta";
import AlertEmptyClienta from "./AlertEmptyClienta";

export function SelectClientas({
    clientasState,
    setClientasState,
    currentPaso,
    setCurrentPaso,
}) {
    const [searchTerm, setSearchTerm] = useSearchTerm();
    const [clientas] = loadHook("useClientas");
    const [isDuplicate, setIsDuplicate] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);

    useEffect(() => {
        return setSearchTerm("");
    }, []);

    return (
        <Box
            h={"100%"}
            w={"100%"}
            pb={"1rem"}
        >
            {clientasState == "nueva" && (
                <Grid
                    gridTemplateColumns={"repeat(2, 1fr)"}
                    gap={"2rem"}
                    mb={"2rem"}
                >
                    <NuevaClienta
                        setClientasState={setClientasState}
                        setCurrentPaso={setCurrentPaso}
                        currentPaso={currentPaso}
                        setSearchTerm={setSearchTerm}
                        setIsDuplicate={setIsDuplicate}
                        setIsEmpty={setIsEmpty}
                        isDuplicate={isDuplicate}
                    />
                </Grid>
            )}

            {isDuplicate && <AlertDuplicateClienta />}
            {isEmpty && <AlertEmptyClienta />}

            {clientas &&
                (clientasState == "buscar" ||
                    isDuplicate) && (
                    <TablaClientas
                        clientas={clientas}
                        setCurrentPaso={setCurrentPaso}
                        searchTerm={searchTerm}
                        isDuplicate={isDuplicate}
                    />
                )}
        </Box>
    );
}
