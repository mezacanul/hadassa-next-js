import { Box, Button, Heading, HStack, Image, Table, Text } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { AiFillPicture } from "react-icons/ai";

export default function Lashistas() {
    const [lashistas, setLashistas] = useState(null);

    useEffect(() => {
        axios.get("/api/lashistas").then((lashistasResp) => {
            console.log(lashistasResp.data);
            setLashistas(lashistasResp.data);
        });
    }, []);

    return (
        <Box w={"100%"}>
            {lashistas && <LashistasTable lashistas={lashistas} />}
        </Box>
    );
}

function LashistasTable({ lashistas }) {
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
                        Lashista
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color={"white"}>
                        Horario Lunes a Viernes
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color={"white"}>
                        Horarios Sábado
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color={"white"}>Rol</Table.ColumnHeader>
                    <Table.ColumnHeader color={"white"}>
                        Acciones
                    </Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {lashistas.map((lashista, i) => (
                    <Table.Row key={i}>
                        <Table.Cell>
                            <Image
                                borderRadius={"50%"}
                                w={"6rem"}
                                // rounded={"md"}
                                src={`/img/lashistas/${lashista.image}`}
                            />
                        </Table.Cell>
                        <Table.Cell>{lashista.nombre}</Table.Cell>
                        <Table.Cell>
                            {JSON.parse(lashista.horarioLV).map((hr)=>{
                                return (
                                    <Text mb={"1rem"} key={hr}>{hr}</Text>
                                )
                            })}
                        </Table.Cell>
                        <Table.Cell>{lashista.horarioSBD}</Table.Cell>
                        <Table.Cell>{lashista.rol}</Table.Cell>
                        <Table.Cell>
                            <Button bg={"pink.500"}>Editar</Button>
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    );
}
