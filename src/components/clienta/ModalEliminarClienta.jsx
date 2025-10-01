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
import { format } from "date-fns-tz";
import { parse, isAfter, isEqual } from "date-fns"; // <-- move to top-level imports

export default function ModalEliminarClienta({
    open,
    setOpen,
    clientaToDelete,
}) {
    const [citas, setCitas] = useState(null);
    const [loading, setLoading] = useState(true);

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
        const citasIDs = citas.map((cita) => cita.id);
        const clientaID = clientaToDelete.id;
        const payload = {
            citas: citasIDs,
            clienta: clientaID,
        };
        console.log(payload);
        return;
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

                        {!loading && (
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
            py={"3rem"}
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
