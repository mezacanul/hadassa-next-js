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
import { MiniSingleton } from "@/utils/lattice-design";
import { useCitaPreview } from "@/pages/nueva-cita/[date]";
import { RiCloseLargeLine } from "react-icons/ri";

const inputStyles = { borderWidth: "1px", borderColor: "pink.600" };

const useClientas = MiniSingleton(null);

export default function SelectClienta() {
    const [citaPreview, setCitaPreview] = useCitaPreview();
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

            <CurrentClienta />

            {citaPreview.clienta == null && (
                <OpcionesClienta setCurrentPanel={setCurrentPanel} />
            )}

            {citaPreview.clienta == null && currentPanel == "buscarClienta" && (
                <ListaBuscarClienta />
            )}
            {citaPreview.clienta == null && currentPanel == "nuevaClienta" && (
                <FormularioNuevaClienta />
            )}
        </VStack>
    );
}

function CurrentClienta() {
    const [citaPreview, setCitaPreview] = useCitaPreview();

    if (citaPreview.clienta != null) {
        return (
            <VStack
                borderRadius={"1rem"}
                bg={"pink.600"}
                color={"white"}
                p={"2rem"}
                px={"3rem"}
                position={"relative"}
            >
                {/* CLose Button  */}
                <Text
                    opacity={"0.7"}
                    color={"white"}
                    fontSize={"lg"}
                    position={"absolute"}
                    right={"0.7rem"}
                    top={"0.7rem"}
                    transition={"all ease 0.3s"}
                    onClick={()=>{setCitaPreview({...citaPreview, clienta: null})}}
                    _hover={{
                        opacity: 1,
                        cursor: "pointer",
                        transform: "scale(1.05)",
                    }}
                >
                    <RiCloseLargeLine />
                </Text>
                <Image
                    borderRadius={"20rem"}
                    src={`/img/clientas/${citaPreview.clienta.foto_clienta}`}
                    w={"8rem"}
                    mb={"2rem"}
                />
                <Heading>
                    {citaPreview.clienta.segundo_nombre}{" "}
                    {citaPreview.clienta.apellido_paterno}
                </Heading>
            </VStack>
        );
    }
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
    const [citaPreview, setCitaPreview] = useCitaPreview();
    const [clientas, setClientas] = useClientas();

    useEffect(() => {
        Promise.all([axios.get("/api/clientas")]).then(([clientasResp]) => {
            setClientas(clientasResp.data);
            console.log(clientasResp.data);
            // console.log("DB data:", serviciosResp.data);
        });
    }, []);

    function getFullNombre(data) {
        return `${data.segundo_nombre} ${data.apellido_paterno}`;
    }

    if (clientas != null) {
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
                                        borderRadius={"20rem"}
                                        src={`/img/clientas/${clienta.foto_clienta}`}
                                        w={"4.5rem"}
                                    />
                                </Table.Cell>
                                <Table.Cell>
                                    {getFullNombre(clienta)}
                                </Table.Cell>
                                <Table.Cell>
                                    <Button
                                        colorPalette={"pink"}
                                        onClick={() => {
                                            setCitaPreview({
                                                ...citaPreview,
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
