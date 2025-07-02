import { CDN } from "@/config/cdn";
import { Box, Button, Heading, HStack, Image, Spinner, Text, VStack } from "@chakra-ui/react";
import InputFotos from "../cita/InputFotos";
import axios from "axios";
import { useState } from "react";

export default function FotoLashistaInput({ lashista }) {
    const [files, setFiles] = useState([]);
    const [fotoLashista, setFotoLashista] = useState(lashista.image)
    const [uploadStatus, setUploadStatus] = useState("iddle")

    const handleFileChange = (acceptedFiles) => {
        setFiles(acceptedFiles);
        // console.log("Selected files:", acceptedFiles);
    };

    const handleUpload = async () => {
        // setUploadStatus("uploading");
        // axios
        //     .patch(`/api/lashistas/${lashista.id}`, {
        //         column: "image",
        //         value: "test"
        //     })
        //     .then((uploadResp2) => { 
        //         setUploadStatus("success");
        //         console.log(uploadResp2);
        //     })
        // return

        if (!files.length) {
            setUploadStatus("error");
            return;
        }

        setUploadStatus("uploading");
        // return;

        const formData = new FormData();
        files.forEach((file) => formData.append("fotoLashista", file)); // Match PHP field name

        try {
            axios
                .post(`${CDN}/uploadFotoLashista.php`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
                .then((uploadResp) => {
                    const resp = uploadResp.data;
                    if (resp.success && resp.url) {
                        console.log(resp);
                        console.log({
                            lashistaID: lashista.id,
                            foto_url: resp.fileName,
                        });
                        axios
                            .patch(`/api/lashistas/${lashista.id}`, {
                                column: "image",
                                value: resp.fileName
                            })
                            .then((uploadResp2) => {
                                console.log(uploadResp2);
                                const resp2 = uploadResp2.data
                                if (resp2.success && resp2.affectedRows == 1) {
                                    setFiles([]);
                                    setUploadStatus("success");
                                    setFotoLashista(resp.fileName)
                                }
                            });
                    }
                });
        } catch (err) {
            console.error("Upload error:", err);
            setUploadStatus("error");
        }
    };

    return (
        <>
            <HStack w={"100%"} align={"end"} gap={"1.5rem"}>
                <Image shadow={"md"} rounded={"lg"} w={"10rem"}
                    src={`${CDN}/img/lashistas/${fotoLashista}`}
                />
                <VStack align={"start"} w={"100%"}>
                    <Heading size={"md"}>Cambiar:</Heading>

                    <HStack align={"end"}>
                        <InputFotos 
                            handleFileChange={handleFileChange} 
                            uploading={uploadStatus == "uploading"} 
                            uploadStatus={uploadStatus} 
                        />
                        {uploadStatus != "uploading" &&
                            <Button
                                onClick={handleUpload}
                                fontWeight={700}
                                colorPalette={"blue"}
                                variant={"subtle"} size={"sm"}>Subir</Button>
                        }
                        {uploadStatus == "uploading" && <Spinner w={"1.4rem"} borderWidth={"3px"} color={"blue.500"} mb={"0.5rem"} />}
                    </HStack>
                </VStack>
            </HStack>

            <Box mb={"1rem"} ps={"11.5rem"}>
                {uploadStatus == "success" && <Text color={"green"}>¡Foto Actualizada!</Text>}
                {uploadStatus == "error" && <Text color={"red"}>Error al actualizar</Text>}
            </Box>
        </>
    )
}
