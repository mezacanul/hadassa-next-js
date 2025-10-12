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
import API from "@/services/main";
import { loadHook } from "@/utils/lattice-design";

export default function ModalEliminarClienta({
    open,
    setOpen,
    clientaToDelete,
}) {
    const [citas, setCitas] = useState(null);
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [clientas, setClientas] = loadHook("useClientas");

    const loadCitas = (clientaID) => {
        axios
            .get(`/api/citas?clienta=${clientaID}`)
            .then((citasResp) => {
                console.log(citasResp.data);
                const citasFiltradas =
                    citasResp.data.filter(returnPendientes);
                setCitas(citasFiltradas);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (open === true) {
            setSuccess(false);
            setLoading(true);
            loadCitas(clientaToDelete.id);
        }
    }, [open]);

    function returnPendientes(cita) {
        const todayMX = new Date(
            new Date().toLocaleString("en-US", {
                timeZone: "America/Mexico_City",
            })
        );
        const [day, month, year] = cita.fecha
            .split("-")
            .map(Number);
        const citaDate = new Date(year, month - 1, day);

        todayMX.setHours(0, 0, 0, 0);
        citaDate.setHours(0, 0, 0, 0);

        const isTodayOrAfter = citaDate >= todayMX;

        console.log(citaDate, todayMX, isTodayOrAfter);
        return isTodayOrAfter && cita.status != 0;
    }

    function handleEliminarClienta() {
        console.log("Eliminar Clienta");
        setLoading(true);
        const clientaID = clientaToDelete.id;
        const citasIDs = citas.map((cita) => cita.id);

        const promiseCalls = [
            API.clientas.deleteClienta(clientaID),
            ...citasIDs.map((citaID) =>
                API.citas.cancelCita(citaID)
            ),
        ];
        Promise.all(promiseCalls).then((responses) => {
            console.log(responses);
            setClientas(
                clientas.filter(
                    (clienta) => clienta.id !== clientaID
                )
            );
            setLoading(false);
            setSuccess(true);
            setTimeout(() => {
                setOpen(false);
            }, 2000);
        });
    }

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
                            {loading && <Loader />}
                            {success && <Success />}
                            {!loading && !success && (
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

                                    <AlertCitasPendientes
                                        length={
                                            citas.length
                                        }
                                    />

                                    {citas.length > 0 && (
                                        <TablaCitas>
                                            {citas &&
                                                citas.map(
                                                    (
                                                        cita
                                                    ) => (
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
                                    )}
                                </VStack>
                            )}
                        </Dialog.Body>

                        {!loading && !success && (
                            <Dialog.Footer>
                                <Dialog.ActionTrigger
                                    asChild
                                >
                                    <Button bg="gray.400">
                                        {"Cancelar"}
                                    </Button>
                                </Dialog.ActionTrigger>
                                <Button
                                    onClick={
                                        handleEliminarClienta
                                    }
                                    bg="red.600"
                                >
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

function AlertCitasPendientes({ length }) {
    return (
        <Alert.Root
            status={`${length > 0 ? "error" : "success"}`}
            w={"100%"}
            shadow={"md"}
            mb={"1rem"}
        >
            <Alert.Indicator />
            <Alert.Title>
                {`${
                    length > 0
                        ? "Esta acción cancelará todas las citas pendientes con esta clienta."
                        : "No hay citas pendientes con esta clienta."
                }`}
            </Alert.Title>
        </Alert.Root>
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
