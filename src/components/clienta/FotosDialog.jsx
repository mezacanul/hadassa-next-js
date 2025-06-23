import { CDN } from "@/config/cdn";
import { useFotoCeja, useFotosCejas } from "../cita/DetallesFaciales";
import { useCita } from "@/pages/citas/[citaID]";
import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, CloseButton, Dialog, Heading, Image, Portal, Spinner, Text } from "@chakra-ui/react";
import InputFotos from "../cita/InputFotos";

export function FotosDialog({ 
    open, 
    setOpen, 
    clientaID, 
    fotosCejas, 
    setFotosCejas, 
    fotoCeja
}) {
    // const [cita] = useCita();
    // const [clientaID, setClientaID] = useState(data ? data.id : null);
    // const [fotoCeja, setFotoCeja] = useFotoCeja();
    // const [fotosCejas, setFotosCejas] = useFotosCejas();
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(null);

    // useEffect(() => {
    //     // if (cita) {
    //     //     setClientaID(cita.clienta_id);
    //     // }
    // }, [cita]);

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