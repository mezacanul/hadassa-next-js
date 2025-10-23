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
import { useEffect, useState } from "react";
import API from "@/services/main";
import { loadHook } from "@/utils/lattice-design";

export default function ModalAccionesCita({
    open,
    setOpen,
    cita = {},
}) {
    return (
        <Dialog.Root
            placement="center"
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
                                {"Acciones Cita"}
                            </Text>
                        </Dialog.Header>

                        <Dialog.Body>
                            {/* {loading && <Loader />}
                            {success && <Success />} */}
                            <Heading
                                size={"md"}
                            >{`Cita ${cita.cita_ID}`}</Heading>
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}

function Loader() {
    return (
        <HStack
            justifyContent={"center"}
            alignItems={"center"}
            py={"5rem"}
            w={"100%"}
            h={"100%"}
        >
            <Spinner
                color="pink.500"
                borderWidth="4px"
                size={"xl"}
            />
        </HStack>
    );
}

function Success() {
    return (
        <HStack
            justifyContent={"center"}
            alignItems={"center"}
            py={"5rem"}
            w={"100%"}
            h={"100%"}
        >
            <Text
                fontSize={"xl"}
                fontWeight={"bold"}
                color={"green.600"}
            >
                {"Operación completada exitosamente"}
            </Text>
        </HStack>
    );
}
