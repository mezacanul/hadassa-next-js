import {
    Button,
    Dialog,
    Text,
    Portal,
    VStack,
    Heading,
    Alert,
    Spinner,
    HStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import TablaCitas from "./TablaCitas";
import CitaRow from "./CitaRow";

export default function ModalEliminarClienta({
    open,
    setOpen,
    clientaToDelete,
    setClientaToDelete,
}) {
    const [citas, setCitas] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadCitas = (clientaID) => {
        axios
            .get(`/api/citas?clienta=${clientaID}`)
            .then((citasResp) => {
                console.log(citasResp.data);
                setCitas(citasResp.data);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (open === true) {
            setLoading(true);
            loadCitas(clientaToDelete.id);
        }
    }, [open]);

    return (
        <Dialog.Root
            size={"lg"}
            lazyMount
            open={open}
            onOpenChange={(e) => setOpen(e.open)}
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Text fontSize={"md"}>
                                {"Eliminar Clienta"}
                            </Text>
                        </Dialog.Header>

                        <Dialog.Body>
                            {loading && (
                                <HStack
                                    justifyContent={
                                        "center"
                                    }
                                    alignItems={"center"}
                                    py={"2rem"}
                                    w={"100%"}
                                    h={"100%"}
                                >
                                    <Spinner
                                        color="pink.500"
                                        borderWidth="4px"
                                        size={"xl"}
                                    />
                                </HStack>
                            )}
                            {!loading && (
                                <VStack
                                    alignItems={"start"}
                                    gap={"1rem"}
                                    mb={"2rem"}
                                >
                                    <DatosClienta
                                        clientaToDelete={
                                            clientaToDelete
                                        }
                                    />

                                    <AlertCitasPendientes />
                                    <TablaCitas>
                                        {citas &&
                                            citas.map(
                                                (cita) => (
                                                    <CitaRow
                                                        key={
                                                            cita.id
                                                        }
                                                        cita={
                                                            cita
                                                        }
                                                    />
                                                )
                                            )}
                                    </TablaCitas>
                                </VStack>
                            )}

                            {/* <Text
                                textAlign={"right"}
                                fontWeight={"bold"}
                            >
                                {"¿Desear continuar?"}
                            </Text> */}
                        </Dialog.Body>

                        {!loading && (
                            <Dialog.Footer>
                                <Dialog.ActionTrigger
                                    asChild
                                >
                                    <Button bg="gray.400">
                                        {"Cancelar"}
                                    </Button>
                                </Dialog.ActionTrigger>
                                <Button bg="red.600">
                                    {"Eliminar"}
                                </Button>
                            </Dialog.Footer>
                        )}
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}

function DatosClienta({ clientaToDelete }) {
    return (
        <VStack
            alignItems={"start"}
            gap={"0.5rem"}
            my={"1rem"}
        >
            <Heading
                size={"xl"}
            >{`${clientaToDelete.nombres} ${clientaToDelete.apellidos}`}</Heading>
            <Heading
                size={"md"}
            >{`+${clientaToDelete.lada} ${clientaToDelete.telefono}`}</Heading>
        </VStack>
    );
}

function AlertCitasPendientes() {
    return (
        <Alert.Root
            status="error"
            w={"100%"}
            shadow={"md"}
            mb={"1rem"}
        >
            <Alert.Indicator />
            <Alert.Title>
                {
                    "Esta acción cancelará todas las citas pendientes con esta clienta."
                }
            </Alert.Title>
        </Alert.Root>
    );
}
