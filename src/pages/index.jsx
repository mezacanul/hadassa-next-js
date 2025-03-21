import { Heading, HStack, Image, Stack, VStack, Grid } from "@chakra-ui/react";
import Hoy from "@/components/Hoy";
import CalendarioMes from "@/components/CalendarioMes";

export default function Index() {
    return (
        <VStack p={"2rem"}>
            {/* <HStack justify={"space-between"} alignItems={"center"} w={"100%"}>
                <Heading size={"4xl"}>Buenos Días!</Heading>
                <Image src="hadassa-logo.jpg" w="6rem" />
            </HStack> */}

            {/* <HStack w={"100%"} justify={"space-between"}>
          <Heading>Agenda del dia</Heading>
          <Heading>Calendario del mes</Heading>
        </HStack> */}
            <Grid mx={"3rem"} templateColumns="3fr 2fr" gap={6} w={"100%"}>
                <Hoy />
                <CalendarioMes />
            </Grid>
        </VStack>
    );
}
