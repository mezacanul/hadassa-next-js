import { Heading, HStack, Image, Stack, VStack, Grid } from "@chakra-ui/react";
import Hoy from "@/components/Hoy";
import CalendarioMes from "@/components/CalendarioMes";

export default function Index() {
    return (
        <VStack p={"2rem"}>
            <Grid mx={"3rem"} templateColumns="3fr 2fr" gap={6} w={"100%"}>
                <Hoy />
                <CalendarioMes />
            </Grid>
        </VStack>
    );
}
