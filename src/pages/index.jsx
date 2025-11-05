import { Grid, VStack } from "@chakra-ui/react";
import Hoy from "@/components/Hoy";
// import CalendarioMes from "@/components/CalendarioMes";
import { loadHook } from "@/utils/lattice-design";
import { useEffect } from "react";
import CamasLive from "@/components/CamasLive";
import CalendarioMesV2 from "@/components/CalendarioMesV2";

export default function Index() {
    const [selectedDate, setSelectedDate] = loadHook(
        "useSelectedDate"
    );
    const [loading, setLoading] = loadHook("useLoader");

    useEffect(() => {
        setLoading(false);
    }, []);

    useEffect(() => {
        console.log("mounted at home", selectedDate);
        // const formattedToday = format(new Date(), "yyyy-MM-dd");
        // if(selectedDate != formattedToday){
        //     setSelectedDate(formattedToday)
        // }
    }, [selectedDate]);

    return (
        <Grid
            templateColumns="5fr 2fr"
            gap={"2.5rem"}
            w={"100%"}
        >
            <Hoy />
            <VStack
                w={"100%"}
                align={"start"}
                gap={"1.5rem"}
            >
                <CamasLive />
                <CalendarioMesV2 />
            </VStack>
        </Grid>
    );
}
