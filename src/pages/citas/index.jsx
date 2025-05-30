import { formatFechaDMY, formatHoyTitle } from "@/utils/main";
import { Box, Heading, Table } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { TfiReceipt } from "react-icons/tfi";


export default function Citas() {
    const [citas, setCitas] = useState(null);

    useEffect(() => {
        axios.get("/api/citas").then((citasResp) => {
            console.log(citasResp.data);
            setCitas(citasResp.data);
        });
    }, []);

    return (
        <Box w={"100%"}>
            {citas && <CitasTable citas={citas} />}
        </Box>
    );
}

function CitasTable({ citas }) {
    return (
        <Table.Root size="md" striped variant={"outline"} bg={"white"} w={"70%"} m={"auto"}>
            <Table.Header>
                <Table.Row bg={"pink.500"}>
                    <Table.ColumnHeader color={"white"}></Table.ColumnHeader>
                    <Table.ColumnHeader color={"white"}>Nombre</Table.ColumnHeader>
                    <Table.ColumnHeader color={"white"}>Servicio</Table.ColumnHeader>
                    <Table.ColumnHeader color={"white"}>Fecha</Table.ColumnHeader>
                    <Table.ColumnHeader color={"white"}>Hora</Table.ColumnHeader>
                    <Table.ColumnHeader color={"white"}>Lashista</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {citas.map((cita, i) => (
                    <Table.Row key={i}>
                        <Table.Cell><TfiReceipt size={"1.7rem"}/></Table.Cell>
                        <Table.Cell>{`${cita.nombres} ${cita.apellidos}`}</Table.Cell>
                        <Table.Cell>{cita.servicio}</Table.Cell>
                        {/* <Table.Cell>{cita.fecha}</Table.Cell> */}
                        <Table.Cell>{formatHoyTitle(formatFechaDMY(cita.fecha))}</Table.Cell>
                        <Table.Cell>{cita.hora}</Table.Cell>
                        <Table.Cell>{cita.lashista}</Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    );
}
