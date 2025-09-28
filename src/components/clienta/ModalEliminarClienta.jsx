import {
    Button,
    Dialog,
    Text,
    Portal,
    VStack,
    Heading,
    Alert,
} from "@chakra-ui/react";

export default function ModalEliminarClienta({
    open,
    setOpen,
    clientaToDelete,
    setClientaToDelete,
}) {
    return (
        <Dialog.Root
            size={"md"}
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
                            <VStack
                                alignItems={"start"}
                                gap={"1rem"}
                                mb={"1rem"}
                            >
                                <DatosClienta
                                    clientaToDelete={
                                        clientaToDelete
                                    }
                                />
                                <AlertCitasPendientes />
                                {/* Lista de citas pendientes */}
                            </VStack>

                            <Text
                                textAlign={"right"}
                                fontWeight={"bold"}
                            >
                                {"¿Desear continuar?"}
                            </Text>
                        </Dialog.Body>

                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button bg="gray.400">
                                    {"Cancelar"}
                                </Button>
                            </Dialog.ActionTrigger>
                            <Button bg="red.600">
                                {"Eliminar"}
                            </Button>
                        </Dialog.Footer>
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
