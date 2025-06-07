import { loadHook } from "@/utils/lattice-design";
import { Box, Button, Heading, HStack, Image, Table } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { AiFillPicture } from "react-icons/ai";

export default function Clientas() {
    const [clientas, setClientas] = useState(null);
    const [loading, setLoading] = loadHook("useLoader");

    useEffect(() => {
        axios.get("/api/clientas").then((clientasResp) => {
            console.log(clientasResp.data);
            setClientas(clientasResp.data);
            setLoading(false)
        });
    }, []);

    return (
        <Box w={"100%"}>
            {clientas && <ClientasTable clientas={clientas} />}
        </Box>
    );
}

function ClientasTable({ clientas }) {
    return (
        <Table.Root
            size="md"
            striped
            variant={"outline"}
            bg={"white"}
            w={"80%"}
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
                        Nombre
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color={"white"}>
                        Telefono
                    </Table.ColumnHeader>
                    {/* <Table.ColumnHeader color={"white"}>
                        Agregada
                    </Table.ColumnHeader> */}
                    <Table.ColumnHeader color={"white"}>
                        Fecha de Nacimiento
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color={"white"}>
                        Detalles
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color={"white"}>
                        Fotos
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color={"white"}>
                        Acciones
                    </Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {clientas.map((clienta, i) => (
                    <Table.Row key={i}>
                        <Table.Cell>
                            <Image
                                w={"10rem"}
                                rounded={"md"}
                                src={`/img/clientas/${clienta.foto_clienta ? clienta.foto_clienta : "avatar-woman.png"}`}
                            />
                        </Table.Cell>
                        <Table.Cell>{`${clienta.nombres} ${clienta.apellidos}`}</Table.Cell>
                        <Table.Cell
                            w={"10rem"}
                        >{`+${clienta.lada} ${clienta.telefono}`}</Table.Cell>
                        {/* <Table.Cell>{clienta.fecha_agregado}</Table.Cell> */}
                        <Table.Cell>{clienta.fecha_de_nacimiento}</Table.Cell>
                        <Table.Cell>{clienta.detalles_cejas}</Table.Cell>
                        <Table.Cell>{clienta.fotos_cejas}</Table.Cell>
                        <Table.Cell>
                            <Button bg={"pink.500"}>Editar</Button>
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    );
}
