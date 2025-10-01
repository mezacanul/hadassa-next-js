import { Table } from "@chakra-ui/react";

export default function TablaCitas({
    children,
    w = "100%",
}) {
    return (
        <Table.Root
            size="md"
            striped
            variant={"outline"}
            bg={"white"}
            w={w}
        >
            <Table.Header>
                <Table.Row bg={"pink.500"}>
                    <Table.ColumnHeader
                        color={"white"}
                    ></Table.ColumnHeader>
                    <Table.ColumnHeader color={"white"}>
                        {"Servicio"}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color={"white"}>
                        {"Fecha"}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color={"white"}>
                        {"Hora"}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color={"white"}>
                        {"Lashista"}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color={"white"}>
                        {"Estado"}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color={"white"}>
                        {"Pagada"}
                    </Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>{children}</Table.Body>
        </Table.Root>
    );
}
