import { CDN } from "@/config/cdn";
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
import InputFotos from "./InputFotos";

const lorem =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut augue tellus, viverra consectetur blandit ac, euismod in tortor. In a bibendum felis, at ultricies tortor. Morbi ac leo et enim semper aliquam id id augue. Quisque sagittis hendrerit accumsan. Cras varius semper vehicula. ";

const useFotoCeja = Singleton(null);

// TO DO: 
// Recibir los detalles de las cejas completos
// es decir:
//    - detallesCejas
//    - fotosCejas
export default function DetallesCejas({ data = null }) {
    const [cita] = useCita();
    const [clientaID, setClientaID] = useState(data ? data.id : null);
    const [detallesCejas, setDetallesCejas] = useState(
        data ? data.detalles_cejas : null
    );
    const [enableActualizar, setEnableActualizar] = useState(false);
    const [open, setOpen] = useState(false);
    const [loadingActualizacion, setLoadingActualizacion] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(null);

    useEffect(() => {
        console.log("TEST", data);
    }, [])

    useEffect(() => {
        if (cita) {
            setDetallesCejas(cita.detalles_cejas);
            setClientaID(cita.clienta_id);
        }
    }, [cita]);

    function actualizarDetallesCejas() {
        setLoadingActualizacion(true);
        axios
            .patch(`/api/clientas/${clientaID}`, {
                column: "detalles_cejas",
                value: detallesCejas,
            })
            .then((clientaResp) => {
                console.log(clientaResp);
                const resp = clientaResp.data;
                console.log("clienta", clientaID);
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
            <FotosDialog open={open} setOpen={setOpen} clientaID={clientaID} />
            <Heading size={"2xl"}>Fotos y Detalles:</Heading>
            <FotosCejas setOpen={setOpen} clientaID={clientaID} />

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
                <Spinner borderWidth={"3px"} size={"lg"} color={"blue.500"} />
            )}
        </VStack>
    );
}

const useFotosCejas = Singleton(null);

function FotosCejas({ setOpen, clientaID = null }) {
    // const [cita, setCita] = useCita();
    const [fotosCejas, setFotosCejas] = useFotosCejas();
    const [fotoCeja, setFotoCeja] = useFotoCeja();
    const [loading, setLoading] = useState(true);

    // useEffect(()=>{
    //     return (
    //         setFotosCejas(null)
    //     )
    // }, [])

    // if (cita) {
    // useEffect(() => {
    //     if (!loading) {
    //         setLoading(true);
    //     }
    //     if (cita) {
    //         // setClientaID(cita.clienta_id)
    //         console.log(cita.clienta_id);
    //         axios
    //             .get(`/api/fotos_cejas?clientaID=${cita.clienta_id}`)
    //             .then((fcResp) => {
    //                 setFotosCejas(fcResp.data);
    //                 setLoading(false);
    //                 console.log(fcResp.data);
    //             });
    //     }
    // }, [cita]);

    useEffect(() => {
        if (clientaID) {
            if (!loading) {
                setFotosCejas(null);
                setLoading(true);
            }
            axios
                .get(`/api/fotos_cejas?clientaID=${clientaID}`)
                .then((fcResp) => {
                    setFotosCejas(fcResp.data);
                    setLoading(false);
                    console.log(fcResp.data);
                });
        }
    }, [clientaID]);

    // }

    return (
        <HStack gap={"1rem"} mb={"1.5rem"}>
            {loading && (
                <Spinner borderWidth={"3px"} size={"xl"} color={"blue.500"} />
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
                            src={`${CDN}/img/cejas/${fotoCeja.foto}`}
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

function FotosDialog({ open, setOpen, clientaID }) {
    const [fotosCejas, setFotosCejas] = useFotosCejas();
    const [cita] = useCita();
    // const [clientaID, setClientaID] = useState(data ? data.id : null);
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [fotoCeja, setFotoCeja] = useFotoCeja();
    const [uploadError, setUploadError] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(null);

    useEffect(() => {
        // if (cita) {
        //     setClientaID(cita.clienta_id);
        // }
    }, [cita]);

    const handleFileChange = (acceptedFiles) => {
        setFiles(acceptedFiles);
        console.log("Selected files:", acceptedFiles);
    };

    const handleUpload = async () => {
        if (!files.length) {
            setUploadError("No files selected");
            return;
        }

        setUploading(true);
        setUploadError(null);
        // return;

        const formData = new FormData();
        files.forEach((file) => formData.append("fotoCejas", file)); // Match PHP field name

        try {
            axios
                .post(`${CDN}/uploadFotoCejas.php`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
                .then((uploadResp) => {
                    const resp = uploadResp.data;
                    if (resp.success && resp.url) {
                        setUploadSuccess(true);
                        setFotosCejas([...fotosCejas, { foto: resp.fileName }]);
                        console.log({
                            clientaID: clientaID,
                            foto_url: resp.fileName,
                        });
                        axios
                            .post("/api/fotos_cejas", {
                                clientaID: clientaID,
                                foto: resp.fileName,
                            })
                            .then((uploadResp) => {
                                console.log(uploadResp);
                            });
                    }
                    setFiles([]);
                    setUploading(false);
                });
        } catch (err) {
            console.error("Upload error:", err.response?.data || err.message);
            setUploadError(err.response?.data?.error || "Failed to upload");
            setUploading(false);
        }
    };

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
                        <Dialog.Body
                            display={"flex"}
                            justifyContent={fotoCeja ? "center" : "start"}
                        >
                            {fotoCeja ? (
                                <Image
                                    my={"3rem"}
                                    w={"35rem"}
                                    objectFit={"cover"}
                                    src={`${CDN}/img/cejas/${fotoCeja}`}
                                />
                            ) : (
                                <Box px={"1rem"} py={"4rem"}>
                                    <Heading mb={"1.5rem"}>
                                        Agregar Imágenes:
                                    </Heading>
                                    <InputFotos
                                        handleFileChange={handleFileChange}
                                        uploading={uploading}
                                    />
                                    {!uploadSuccess && uploading == false && (
                                        <Button
                                            onClick={handleUpload}
                                            disabled={
                                                files?.length > 0 ? false : true
                                            }
                                            isLoading={uploading}
                                            mt={4}
                                            bg={"pink.500"}
                                        >
                                            Subir Foto
                                        </Button>
                                    )}
                                    {uploading && (
                                        <Spinner
                                            mt={4}
                                            borderWidth={"3px"}
                                            size={"lg"}
                                            color={"blue.500"}
                                        />
                                    )}
                                    {uploadError && (
                                        <p style={{ color: "red" }}>
                                            Error: {uploadError}
                                        </p>
                                    )}
                                    {uploadSuccess && (
                                        <Text mt={4} color={"green"}>
                                            ¡Foto agregada exitosamente!
                                        </Text>
                                    )}
                                </Box>
                            )}
                        </Dialog.Body>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton
                                size="sm"
                                onClick={() => {
                                    console.log("closing");
                                    setUploadSuccess(false);
                                }}
                            />
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
