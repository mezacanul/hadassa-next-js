import { Box, Grid, GridItem, VStack } from "@chakra-ui/react";
import servicios from "/public/data/servicios.json";
import Servicio from "./Servicio";

export default function ListaServicios({setShowServicios}) {
    return (
        <Grid templateColumns={"repeat(3, 1fr)"} py={"2rem"} align={"start"} gap={"6rem"}>
            {servicios.map((srv) => {
                return (
                    <GridItem key={srv.id}>
                        <Servicio data={srv} setShowServicios={setShowServicios} />
                    </GridItem>
                );
            }, [])}
        </Grid>
    );
}
