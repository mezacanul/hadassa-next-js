import { VStack, Grid, Heading } from "@chakra-ui/react";
import Hoy from "@/components/Hoy";
import CalendarioMes from "@/components/CalendarioMes";
import { loadHook, Singleton } from "@/utils/lattice-design";
import { useEffect, useState } from "react";
import { formatHoyTitle } from "../utils/main";
import { format } from "date-fns";

export default function Index() {
    const [selectedDate, setSelectedDate] = loadHook("useSelectedDate");
    const [loading, setLoading] = loadHook("useLoader");

    useEffect(()=>{
        setLoading(false)
    }, [])

    useEffect(()=>{
        console.log("mounted at home", selectedDate);
        // const formattedToday = format(new Date(), "yyyy-MM-dd");
        // if(selectedDate != formattedToday){
        //     setSelectedDate(formattedToday)
        // }
    }, [selectedDate])

    return (
        <Grid templateColumns="3fr 2fr" gap={"2.5rem"} w={"100%"}>
            <Hoy />
            <CalendarioMes />
        </Grid>
    );
}
