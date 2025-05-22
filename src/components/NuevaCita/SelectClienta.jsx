import {
    Box,
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
import { Singleton } from "@/utils/lattice-design";
import { useCurrentCita } from "@/pages/nueva-cita/[date]";
import { RiCloseLargeLine } from "react-icons/ri";
import RemoveButton from "../common/RemoveButton";

const inputStyles = {
    borderWidth: "1.5px",
    borderColor: "pink.500",
    width: "40%",
};

const useClientas = Singleton(null);

export default function SelectClienta() {
    const [currentCita, setCurrentCita] = useCurrentCita();
    const [currentPanel, setCurrentPanel] = useState("none");

    if (currentCita.clienta == null) {
        return (
            <VStack align={"center"}>
                <HStack
                justify={"center"}
                    mt={"1rem"}
                    gap={"2rem"}
                    w={"100%"}
                    align={"end"}
                    mb={"1rem"}
                >
                    <Heading
                        fontWeight={300}
                        size={"5xl"}
                        mb={"-0.5rem"}
                        color={"pink.600"}
                    >
                        Clienta
                    </Heading>

                    <OpcionesClienta setCurrentPanel={setCurrentPanel} />
                </HStack>
                {/* {currentPanel == "buscarClienta" && <ListaBuscarClienta />} */}
                <ListaBuscarClienta />

                {/* {currentPanel == "nuevaClienta" && <FormularioNuevaClienta />} */}
            </VStack>
        );
    }
}

export function CurrentClienta() {
    const [currentCita, setCurrentCita] = useCurrentCita();

    if (currentCita.clienta != null) {
        return (
            <VStack
                h={"100%"}
                borderRadius={"1rem"}
                bg={"pink.600"}
                color={"white"}
                py={"6rem"}
                px={"3rem"}
                position={"relative"}
                justify={"center"}
            >
                {/* CLose Button  */}
                <RemoveButton
                    onClick={() => {
                        setCurrentCita({ ...currentCita, clienta: null });
                    }}
                />

                <Text mb={"0.5rem"}>Clienta:</Text>
                <Image
                    borderRadius={"20rem"}
                    src={`/img/clientas/${currentCita.clienta.foto_clienta}`}
                    w={"6rem"}
                    // mb={"0.5rem"}
                />
                <Heading>{currentCita.clienta.nombre_completo}</Heading>
                <Text opacity={"0.7"} fontSize={"sm"}>
                    {`(${currentCita.clienta.telefono})`}
                </Text>
            </VStack>
        );
    }
}

function OpcionesClienta({ setCurrentPanel }) {
    return (
        <HStack gap={"1rem"}>
            {/* <Button
                // disabled
                fontSize={"md"}
                size={"md"}
                colorPalette={"pink"}
                onClick={() => {
                    setCurrentPanel("buscarClienta");
                }}
            >
                Buscar
            </Button> */}
            <Input {...inputStyles} w={"15rem"} placeholder="Buscar" />
            {/* <Button
                // disabled
                fontSize={"md"}
                size={"md"}
                colorPalette={"pink"}
                onClick={() => {
                    setCurrentPanel("nuevaClienta");
                }}
            >
                Nueva
            </Button> */}
        </HStack>
    );
}

function ListaBuscarClienta() {
    return (
        <Box
            w={"100%"}
            height={"40vh"}
            overflowY={"scroll"}
            borderColor={"pink.500"}
            borderWidth={"1px"}
            borderRadius={"0.5rem"}
        >
            <ListaClientas />
        </Box>
    );
}

function ListaClientas() {
    const [currentCita, setCurrentCita] = useCurrentCita();
    const [clientas, setClientas] = useClientas();

    useEffect(() => {
        Promise.all([axios.get("/api/clientas")]).then(([clientasResp]) => {
            setClientas(clientasResp.data);
            console.log(clientasResp.data);
            // console.log("DB data:", serviciosResp.data);
        });
    }, []);

    if (clientas != null) {
        return (
            // <VStack>
            <Table.Root variant={"outline"} interactive>
                {/* <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader>Foto</Table.ColumnHeader>
                        <Table.ColumnHeader>Nombre</Table.ColumnHeader>
                        <Table.ColumnHeader>Acciones</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header> */}
                <Table.Body>
                    {clientas.map((clienta) => {
                        return (
                            <Table.Row key={clienta.id}>
                                <Table.Cell>
                                    <Image
                                        borderRadius={"20rem"}
                                        src={`/img/clientas/${clienta.foto_clienta}`}
                                        w={"4.5rem"}
                                    />
                                </Table.Cell>
                                <Table.Cell>
                                    {clienta.nombre_completo}
                                </Table.Cell>
                                <Table.Cell textAlign={"center"}>
                                    <Button
                                        colorPalette={"pink"}
                                        onClick={() => {
                                            setCurrentCita({
                                                ...currentCita,
                                                clienta: clienta,
                                            });
                                        }}
                                    >
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
