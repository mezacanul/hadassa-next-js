import { Button, Grid, Image, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ListaLashistas() {
    const [lashistas, setLashistas] = useState([]);

    useEffect(() => {
        Promise.all([axios.get("/api/lashistas")]).then(([LashistaResp]) => {
            setLashistas(LashistaResp.data);
            console.log("DB data:", LashistaResp.data);
        });
    }, []);

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
