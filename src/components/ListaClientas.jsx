import { Box, Grid, GridItem, Heading, VStack } from "@chakra-ui/react";
import servicios from "/public/data/servicios.json";
import Servicio from "./Servicio";

export default function ListaClientas({setShowServicios}) {
    return (
        <Heading>Componente: Lista de Clientas</Heading>
        // <Grid templateColumns={"repeat(3, 1fr)"} py={"2rem"} align={"start"} gap={"6rem"}>
        //     {servicios.map((srv) => {
        //         return (
        //             <GridItem key={srv.id}>
        //                 <Servicio data={srv} setShowServicios={setShowServicios} />
        //             </GridItem>
        //         );
        //     }, [])}
        // </Grid>
    );
}
