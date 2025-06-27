import { CDN } from "@/config/cdn";
import { useFotoCeja, useFotosCejas } from "../cita/DetallesFaciales";
import { useCita } from "@/pages/citas/[citaID]";
import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, CloseButton, Dialog, Heading, HStack, Image, Portal, Spinner, Text, VStack } from "@chakra-ui/react";
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
    const [deleteStatus, setDeleteStatus] = useState("default")

    useEffect(() => {
        return (setDeleteStatus("default"))
    }, []);

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
        // files.forEach((file) => formData.append(`fotoCejas`, file)); // Match PHP field name
        files.forEach((file, i) => formData.append(`fotoCejas-${i}`, file)); // Match PHP field name
        for (let [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(`Key: ${key}, Name: ${value.name}, Size: ${value.size}, Type: ${value.type}`);
            }
        }
        // return

        try {
            axios
                .post(`${CDN}/uploadFotoCejas.php`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
                .then((uploadResp) => {
                    const resp = uploadResp.data;
                    // console.log(resp);
                    // return
                    // if (resp.success && resp.url) {
                    if (resp.success) {
                        const newFiles = resp.files.map((file) => (
                            { foto: file.fileName }
                            // { foto: "test.jpg" }
                        ))
                        console.log(newFiles);
                        // setFotosCejas([...fotosCejas, { foto: resp.fileName }]);
                        // console.log({
                        //     clientaID: clientaID,
                        //     foto_url: resp.fileName,
                        // });
                        // return
                        axios
                            .post("/api/fotos_cejas", {
                                clientaID: clientaID,
                                fotos: newFiles,
                                // foto: resp.fileName,
                            })
                            .then((uploadResp) => {
                                console.log(uploadResp);
                                const resp = uploadResp.data
                                if (resp.success) {
                                    setFiles([]);
                                    setUploading(false);
                                    setUploadSuccess(true);
                                    setFotosCejas([...fotosCejas, ...resp.inserted]);
                                }
                            });
                    }
                    // setUploading(false);
                });
        } catch (err) {
            console.error("Error al subir:", err.response?.data || err.message);
            setUploadError(err.response?.data?.error || "Error al cargar imágenes");
            setUploading(false);
        }
    };

    function handleEliminarFoto() {
        setDeleteStatus("deleting")
        console.log(fotoCeja, clientaID);
        axios
            .post(`${CDN}/deleteFotoCejas.php`, { fileName: fotoCeja }, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((axiosResp) => {
                console.log(axiosResp);
                const resp = axiosResp.data

                if(resp.success){
                    axios
                        .delete(`/api/fotos_cejas?clienta_id=${clientaID}&foto=${resp.fileName}`)
                        .then((deleteResp)=>{
                            console.log(deleteResp);
                            
                            const resp2 = deleteResp.data
                            if(resp2.success && resp2.affectedRows > 0){
                                const filteredFotos = fotosCejas.filter((fc)=>{
                                    return fc.foto != fotoCeja
                                })
                                setFotosCejas(filteredFotos)
                                setOpen(false)
                                console.log(
                                    resp2.foto, 
                                    filteredFotos,
                                );
                            }
                            setDeleteStatus("default")
                        })
                }
            })
    }

    return (
        <Dialog.Root
            placement={"center"}
            motionPreset="slide-in-bottom"
            lazyMount
            open={open}
            onOpenChange={(e) => setOpen(e.open)}
            size={fotoCeja ? "cover" : "md"}
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
                            // flexDir={"column"}
                            justifyContent={fotoCeja ? "center" : "start"}
                            alignItems={"center"}
                            h={fotoCeja ? "100%" : "initial"}
                            pt={"2rem"}
                        >
                            {fotoCeja ? (
                                <VStack my={"3rem"} alignItems={"start"}>
                                    <Box mb={"1rem"} h={"80vh"} pt={"1.5rem"}>
                                        <Image
                                            shadow={"md"}
                                            w={"100%"}
                                            height={"100%"}
                                            // h={"60vh"}
                                            objectFit={"cover"}
                                            src={`${CDN}/img/cejas/${fotoCeja}`}
                                        />
                                    </Box>
                                    <HStack mb={"1.5rem"}>
                                        <Button
                                            disabled={deleteStatus != "default"}
                                            onClick={() => {
                                                setDeleteStatus("confirmar")
                                            }}
                                            shadow={"sm"}
                                            variant={"outline"}
                                            colorPalette={"orange"}
                                        >
                                            Eliminar</Button>

                                        {deleteStatus == "confirmar" && (
                                            <Button
                                                onClick={handleEliminarFoto}
                                                shadow={"sm"}
                                                bg={"red.500"}
                                            >
                                                Confirmar</Button>
                                        )}
                                        {deleteStatus == "deleting" && (
                                            <Spinner
                                                borderWidth={"2px"}
                                                size={"md"}
                                                color={"red.600"}
                                            />
                                        )}
                                    </HStack>
                                </VStack>
                            ) : (
                                <Box px={"1rem"} py={"4rem"}>
                                    <VStack alignItems={"start"} mb={"1rem"}>
                                        <Heading>
                                            Agregar Imágenes:
                                        </Heading>
                                        <Text>{"(Maximo 5 imágenes por carga)"}</Text>
                                        <Text>{"JPG, JPEG, PNG"}</Text>
                                    </VStack>
                                    <InputFotos
                                        handleFileChange={handleFileChange}
                                        uploading={uploading}
                                        maxFiles={5}
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
                                            {"Subir"}
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
                                            ¡Fotos agregadas exitosamente!
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
                                    setTimeout(() => {
                                        setUploading(false)
                                    }, 500);
                                }}
                            />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}