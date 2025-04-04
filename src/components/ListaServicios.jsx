import { Box, Grid, GridItem, VStack } from "@chakra-ui/react";
import Servicio from "./Servicio";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ListaServicios({setShowServicios}) {
    const [servicios, setServicios] = useState([]);

    useEffect(() => {
        Promise.all([axios.get("/api/servicios")]).then(([serviciosResp]) => {
            setServicios(serviciosResp.data);
            // console.log("DB data:", serviciosResp.data);
        });
    }, []);

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
