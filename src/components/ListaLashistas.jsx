import lashistas from "/public/data/lashistas.json";
import {
    Box,
    Button,
    Grid,
    Heading,
    HStack,
    Image,
    Link,
    Text,
    VStack,
} from "@chakra-ui/react";
import { Children, useEffect } from "react";
import { TfiTime } from "react-icons/tfi";
import { BsCalendar2CheckFill } from "react-icons/bs";
import { IoTimeSharp } from "react-icons/io5";

export default function ListaLashistas() {
    return (
        <Grid
            templateColumns={"repeat(3, 1fr)"}
            // alignItems={"center"}
            w={"100%"}
            // align={"start"}
            // gap={"3rem"}
        >
            {lashistas.map((lsh) => {
                return <Lashista key={lsh.id} data={lsh} />;
            }, [])}
        </Grid>
    );
}

function Lashista({ data }) {
    useEffect(() => {
        console.log(data);
    }, []);
    return (
        <VStack align={"center"} w={"100%"} gap={"2rem"}>
            <Image
                // me={"1rem"}
                boxShadow={"-4px 4px 8px rgba(0,0,0,0.2)"}
                borderRadius={"100%"}
                objectFit={"cover"}
                w={"8rem"}
                src={`/img/lashistas/${data.image}`}
            />
            <Button fontSize={"lg"} size={"lg"} bg={"pink.500"}>
                {data.nombre}
            </Button>
            {/* <Heading color={"pink.500"}>{data.nombre}</Heading> */}
        </VStack>
    );
}
