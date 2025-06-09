import { useCita } from "@/pages/citas/[citaID]";
import { Singleton } from "@/utils/lattice-design";
import {
    Box,
    Button,
    CloseButton,
    Dialog,
    Heading,
    HStack,
    Image,
    Portal,
    Spinner,
    Square,
    Text,
    Textarea,
    VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

const lorem =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut augue tellus, viverra consectetur blandit ac, euismod in tortor. In a bibendum felis, at ultricies tortor. Morbi ac leo et enim semper aliquam id id augue. Quisque sagittis hendrerit accumsan. Cras varius semper vehicula. ";

const useFotoCeja = Singleton(null);

export default function DetallesCejas() {
    const [cita] = useCita();
    const [detallesCejas, setDetallesCejas] = useState(null);
    const [enableActualizar, setEnableActualizar] = useState(false);
    const [open, setOpen] = useState(false);
    const [loadingActualizacion, setLoadingActualizacion] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(null);

    useEffect(() => {
        if (cita.detalles_cejas) {
            setDetallesCejas(cita.detalles_cejas);
        }
    }, [cita]);

    function actualizarDetallesCejas() {
        setLoadingActualizacion(true);
        axios
            .patch(`/api/clientas/${cita.clienta_id}`, {
                column: "detalles_cejas",
                value: detallesCejas
            })
            .then((clientaResp) => {
                console.log(clientaResp);
                const resp = clientaResp.data;
                console.log("clienta", cita.clienta_id);
                console.log("texto", detallesCejas);

                if (resp.success && resp.affectedRows == 1) {
                    setUpdateSuccess(true);
                    setEnableActualizar(false);
                } else {
                    alert("Error");
                }
                setLoadingActualizacion(false);
            });
    }

    return (
        <VStack align={"start"} gap={"1.5rem"} w={"100%"}>
            <FotosDialog open={open} setOpen={setOpen} />
            <Heading size={"2xl"}>Detalles de Cejas:</Heading>
            <FotosCejas setOpen={setOpen} />

            <Heading>Descripción:</Heading>
            <Textarea
                h={"10rem"}
                shadow={"sm"}
                bg={"white"}
                w={"70%"}
                value={detallesCejas ? detallesCejas : ""}
                onChange={(e) => {
                    setEnableActualizar(true);
                    setDetallesCejas(e.target.value);
                }}
            />
            {!loadingActualizacion && (
                <HStack gap={"1.5rem"}>
                    <Button
                        colorPalette={"blue"}
                        shadow={"sm"}
                        variant={"subtle"}
                        fontWeight={700}
                        disabled={enableActualizar ? false : true}
                        onClick={actualizarDetallesCejas}
                    >
                        Actualizar Descripción
                    </Button>
                    {updateSuccess && (
                        <Text color={"green"}>¡Actualizado exitosamente!</Text>
                    )}
                </HStack>
            )}
            {loadingActualizacion && (
                <Spinner borderWidth={"3px"} size={"lg"} color={"pink.500"} />
            )}
        </VStack>
    );
}

function FotosCejas({ setOpen }) {
    const [cita] = useCita();
    const [fotosCejas, setFotosCejas] = useState(null);
    const [fotoCeja, setFotoCeja] = useFotoCeja();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!loading) {
            setLoading(true);
        }
        if (cita.clienta_id) {
            console.log(cita.clienta_id);
            axios
                .get(`/api/fotos_cejas?clientaID=${cita.clienta_id}`)
                .then((fcResp) => {
                    setFotosCejas(fcResp.data);
                    setLoading(false);
                    console.log(fcResp.data);
                });
        }
    }, [cita.cita_ID]);

    return (
        <HStack gap={"1rem"} mb={"1.5rem"}>
            {loading && (
                <Spinner borderWidth={"3px"} size={"xl"} color={"pink.500"} />
            )}
            {fotosCejas &&
                !loading &&
                fotosCejas.map((fotoCeja, idx) => {
                    return (
                        <Image
                            onClick={() => {
                                setFotoCeja(fotoCeja.foto);
                                setOpen(true);
                            }}
                            key={idx}
                            transition={hoverStyles.transition}
                            _hover={{ ...hoverStyles.onHover }}
                            objectFit={"cover"}
                            shadow={"sm"}
                            rounded={"md"}
                            w={"5rem"}
                            h={"5rem"}
                            src={`/img/cejas/${fotoCeja.foto}`}
                        />
                    );
                })}
            {!loading && (
                <AddButton
                    onClick={() => {
                        setFotoCeja(null);
                        setOpen(true);
                    }}
                />
            )}
        </HStack>
    );
}

function FotosDialog({ open, setOpen }) {
    const [fotoCeja, setFotoCeja] = useFotoCeja();

    return (
        <Dialog.Root
            placement={"center"}
            motionPreset="slide-in-bottom"
            lazyMount
            open={open}
            onOpenChange={(e) => setOpen(e.open)}
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        {/* <Dialog.Header>
                            <Dialog.Title>Dialog Title</Dialog.Title>
                        </Dialog.Header> */}
                        <Dialog.Body display={"flex"} justifyContent={"center"}>
                            {fotoCeja ? (
                                <Image
                                    my={"3rem"}
                                    w={"35rem"}
                                    objectFit={"cover"}
                                    src={`/img/cejas/${fotoCeja}`}
                                />
                            ) : (
                                <Text>Subir Foto</Text>
                            )}
                        </Dialog.Body>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}

function AddButton({ onClick }) {
    return (
        <HStack
            onClick={onClick}
            h={"5rem"}
            w={"5rem"}
            rounded={"md"}
            border={"2px solid gray"}
            justifyContent={"center"}
            alignItems={"center"}
            transition={hoverStyles.transition}
            _hover={{ ...hoverStyles.onHover }}
        >
            <Heading color={"gray"} size={"3xl"}>
                +
            </Heading>
        </HStack>
    );
}

const hoverStyles = {
    transition: "all ease 0.3s",
    onHover: { cursor: "pointer", transform: "scale(1.1)" },
};
