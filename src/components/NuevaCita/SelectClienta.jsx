import {
    Button,
    Heading,
    HStack,
    Image,
    Input,
    Table,
    Text,
    VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
// import { loadHook } from "@/utils/PortableContext";
// import { MiniSingleton } from "@/utils/MiniSingleton";
import { loadHook } from "@/utils/fractal-design";

const inputStyles = {borderWidth:"1px", borderColor: "pink.600"}

// const useClientas = MiniSingleton([]);
// const ClientasMSt = MiniSingleton([]);

export default function SelectClienta() {
    const [currentPanel, setCurrentPanel] = useState("none");

    return (
        <VStack gap={"2rem"}>
            <Heading
                fontWeight={300}
                mb={"1rem"}
                size={"5xl"}
                color={"pink.600"}
            >
                Clienta
            </Heading>

            <OpcionesClienta setCurrentPanel={setCurrentPanel} />

            {currentPanel == "buscarClienta" && <ListaBuscarClienta />}
            {currentPanel == "nuevaClienta" && <FormularioNuevaClienta />}
        </VStack>
    );
}

function OpcionesClienta({ setCurrentPanel }) {
    return (
        <HStack>
            <Button
                // disabled
                fontSize={"xl"}
                size={"xl"}
                colorPalette={"pink"}
                onClick={() => {
                    setCurrentPanel("buscarClienta");
                }}
            >
                Buscar
            </Button>
            <Button
                // disabled
                fontSize={"xl"}
                size={"xl"}
                colorPalette={"pink"}
                onClick={() => {
                    setCurrentPanel("nuevaClienta");
                }}
            >
                Nueva Clienta
            </Button>
        </HStack>
    );
}

function ListaBuscarClienta() {
    return (
        <>
            <Input {...inputStyles} placeholder="Buscar" />
            <ListaClientas />
        </>
    );
}

function ListaClientas() {
    // const [clientas, setClientas] = ClientasMSt();
    // const clientas = []
    const [clientas, setClientas] = loadHook("useClientas");

    useEffect(() => {
        Promise.all([axios.get("/api/clientas")]).then(([clientasResp]) => {
            setClientas(clientasResp.data);
            console.log(clientasResp.data);
            // console.log("DB data:", serviciosResp.data);
        });
    }, []);

    function getFullNombre(data) {
        return `${data.primer_nombre} ${data.segundo_nombre} ${data.apellido_paterno} ${data.apellido_materno}`;
    }

    return (
        // <VStack>
        <Table.Root size="md" variant={"outline"} interactive>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader>Foto</Table.ColumnHeader>
                    <Table.ColumnHeader>Nombre</Table.ColumnHeader>
                    <Table.ColumnHeader>Acciones</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {clientas.map((clienta) => {
                    return (
                        <Table.Row key={clienta.id}>
                            <Table.Cell>
                                <Image
                                    src={`/img/clientas/${clienta.foto_clienta}`}
                                    w={"4rem"}
                                />
                            </Table.Cell>
                            <Table.Cell>{getFullNombre(clienta)}</Table.Cell>
                            <Table.Cell>
                                <Button colorPalette={"pink"}>
                                    Seleccionar
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table.Root>
        // </VStack>
    );
}

function FormularioNuevaClienta() {
    return (
        <VStack gap={"2rem"}>
            <Input {...inputStyles} placeholder="Nombre Completo" />
            <HStack>
                <Input w={"25%"} {...inputStyles} placeholder="Lada" />
                <Input w={"75%"} {...inputStyles} placeholder="Telefono" />
            </HStack>
            <Button fontSize={"xl"} size={"xl"} colorPalette={"pink"}>
                Agregar Clienta
            </Button>
        </VStack>
    );
}
