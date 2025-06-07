import { loadHook } from "@/utils/lattice-design";
import { Box, Button, Heading, HStack, Image, Table } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { AiFillPicture } from "react-icons/ai";

export default function Servicios() {
    const [servicios, setServicios] = useState(null);
    const [loading, setLoading] = loadHook("useLoader");

    useEffect(() => {
        axios.get("/api/servicios").then((serviciosResp) => {
            console.log(serviciosResp.data);
            setServicios(serviciosResp.data);
            setLoading(false)
        });
    }, []);

    return (
        <Box w={"100%"}>
            {servicios && <ServiciosTable servicios={servicios} />}
        </Box>
    );
}

function ServiciosTable({ servicios }) {
    return (
        <Table.Root
            size="md"
            striped
            variant={"outline"}
            bg={"white"}
            w={"70%"}
            m={"auto"}
        >
            <Table.Header>
                <Table.Row bg={"pink.500"}>
                    <Table.ColumnHeader color={"white"}>
                        {/* <HStack justify={"center"}>
                            <AiFillPicture size={"1.5rem"} />
                        </HStack> */}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color={"white"}>
                        Servicio
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color={"white"}>
                        Descripcion
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color={"white"}>
                        Duración
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color={"white"}>
                        Precio
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color={"white"}>
                        Directiva
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color={"white"}>
                        Acciones
                    </Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {servicios.map((servicio, i) => (
                    <ServicioRow key={i} servicio={servicio}/>
                ))}
            </Table.Body>
        </Table.Root>
    );
}

function ServicioRow({ servicio }) {
    let reglaTitle = ""
    const reglasAgenda = JSON.parse(servicio.reglas_agenda)
    switch (reglasAgenda[0]) {
        case -1:
            reglaTitle = "Puede agendar especial"
            break;
        case 0:
            reglaTitle = "Especial"
            break;
        case 1:
            reglaTitle = "No agenda especial"
            break;
        default: break;
    }
    return (
        <Table.Row>
            <Table.Cell>
                <Image
                    w={"20rem"}
                    rounded={"md"}
                    src={`/img/servicios/${servicio.image}`}
                />
            </Table.Cell>
            <Table.Cell>{servicio.servicio}</Table.Cell>
            <Table.Cell>{servicio.descripcion}</Table.Cell>
            <Table.Cell>{servicio.minutos}</Table.Cell>
            <Table.Cell>{`$${servicio.precio}`}</Table.Cell>
            <Table.Cell>{reglaTitle}</Table.Cell>
            <Table.Cell>
                <Button bg={"pink.500"}>Editar</Button>
            </Table.Cell>
        </Table.Row>
    );
}
