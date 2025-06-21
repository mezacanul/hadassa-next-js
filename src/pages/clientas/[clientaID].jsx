import DetallesCejas from "@/components/cita/DetallesCejas";
import InputFotos from "@/components/cita/InputFotos";
import { CDN } from "@/config/cdn";
import { loadHook, Singleton } from "@/utils/lattice-design";
import { Box, Button, Grid, GridItem, Heading, HStack, Image, Input, Spinner, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const useClientaForm = Singleton({
    nombres: "",
    apellidos: "",
    lada: "",
    telefono: ""
})

export default function Clienta() {
    const router = useRouter();
    const { clientaID } = router.query;
    const [clientaForm, setClientaForm] = useClientaForm()
    const [loading, setLoading] = loadHook("useLoader");
    const [clienta, setClienta] = useState(null);

    useEffect(() => {
        if (router.isReady) {
            console.log("CID", clientaID);
            Promise.all([axios.get(`/api/clientas/${clientaID}`)]).then(
                ([clientaResp]) => {
                    console.log(clientaResp);
                    setClienta(clientaResp.data[0]);
                    setLoading(false);
                }
            );
        }
    }, [router.isReady]);

    useEffect(() => {
        if (clienta) {
            setClientaForm({
                nombres: clienta.nombres,
                apellidos: clienta.apellidos,
                lada: clienta.lada,
                telefono: clienta.telefono
            })
        }
    }, [clienta])

    return (
        <Box w={"80%"}>
            {clienta && <ClientaAvatar clienta={clienta} clientaID={clientaID} />}
            {clienta && <DetallesCejas data={clienta} />}
        </Box>
    );
}

function ClientaAvatar({ clienta, clientaID }) {
    const [clientaForm, setClientaForm] = useClientaForm()
    const [files, setFiles] = useState([]);
    const [fotoClienta, setFotoClienta] = useState(clienta.foto_clienta)
    const [uploadStatus, setUploadStatus] = useState("iddle")
    const [actualizarStatus, setActualizarStatus] = useState("iddle")

    useEffect(() => {
        console.log(clienta);
    }, [clienta])

    const handleFileChange = (acceptedFiles) => {
        setFiles(acceptedFiles);
        // console.log("Selected files:", acceptedFiles);
    };

    const handleUpload = async () => {
        if (!files.length) {
            setUploadStatus("error");
            return;
        }

        setUploadStatus("uploading");
        // return;

        const formData = new FormData();
        files.forEach((file) => formData.append("fotoClienta", file)); // Match PHP field name

        try {
            axios
                .post(`${CDN}/uploadFotoClienta.php`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
                .then((uploadResp) => {
                    const resp = uploadResp.data;
                    if (resp.success && resp.url) {
                        console.log(resp);
                        setFotoClienta(resp.fileName)
                        console.log({
                            clientaID: clientaID,
                            foto_url: resp.fileName,
                        });
                        axios
                            .patch(`/api/clientas/${clientaID}`, {
                                column: "foto_clienta",
                                value: resp.fileName
                            })
                            .then((uploadResp2) => {
                                console.log(uploadResp2);
                                const resp2 = uploadResp2.data
                                if (resp2.success && resp2.affectedRows == 1) {
                                    setFiles([]);
                                    setUploadStatus("success");
                                }
                            });
                    }
                });
        } catch (err) {
            console.error("Upload error:", err);
            setUploadStatus("error");
        }
    };

    const handleActualizarDatos = () => {
        setActualizarStatus("updating")
        // return
        console.log(clientaForm);
        axios
            .patch(`/api/clientas/${clientaID}`, {
                type: "batch",
                payload: clientaForm
            })
            .then((axiosResp) => {
                console.log(axiosResp);
                const resp = axiosResp.data
                if (resp.success && resp.affectedRows == 1) {
                    setActualizarStatus("success");
                }
            })
            .catch((err)=>{
                console.log(err);
                setActualizarStatus("error");
            })
    }

    return (
        <VStack alignItems={"start"} w={"60%"} gap={"1rem"} mb={"2rem"}>
            <HStack align={"end"} gap={"1.5rem"}>
                <Image shadow={"md"} rounded={"lg"} w={"10rem"}
                    src={
                        fotoClienta
                            ? `${CDN}/img/clientas/${fotoClienta}`
                            : `${CDN}/img/clientas/avatar-woman.png`
                    }
                />
                <VStack align={"start"} w={"100%"}>
                    <Heading size={"md"}>Cambiar:</Heading>

                    <HStack align={"end"}>
                        <InputFotos handleFileChange={handleFileChange} uploading={uploadStatus == "uploading"} uploadStatus={uploadStatus} />
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

            <Input
                onChange={(e) => {
                    setClientaForm({ ...clientaForm, nombres: e.target.value })
                    e.target.value
                }}
                value={clientaForm.nombres} {...inputStyles} placeholder="Nombres" />
            <Input
                onChange={(e) => {
                    setClientaForm({ ...clientaForm, apellidos: e.target.value })
                    e.target.value
                }}
                value={clientaForm.apellidos} {...inputStyles} placeholder="Apellidos" />
            <PhoneInput clienta={clienta} />

            <HStack gap={"1rem"}>
                <Button colorPalette={"blue"}
                    disabled={actualizarStatus == "updating"}
                    onClick={handleActualizarDatos}
                    shadow={"sm"}
                    variant={"subtle"}
                    fontWeight={700}
                >
                    Actualizar Datos
                </Button>
                {actualizarStatus == "updating" && <Spinner color={"blue.500"} borderWidth={"3px"} />}
                {actualizarStatus == "success" && <Text color={"green"}>¡Actualizado Exitosamente!</Text>}
                {actualizarStatus == "error" && <Text color={"red"}>Error al actualizar</Text>}
            </HStack>
        </VStack>
    )
}

function PhoneInput({ clienta, w = "100%" }) {
    const [clientaForm, setClientaForm] = useClientaForm()

    return (
        <HStack w={w}>
            <Heading>+</Heading>
            <Input
                onChange={(e) => {
                    setClientaForm({ ...clientaForm, lada: e.target.value })
                    e.target.value
                }}
                value={clientaForm.lada} w={"20%"} {...inputStyles} placeholder="Lada" />
            <Input
                value={clientaForm.telefono}
                onChange={(e) => {
                    setClientaForm({ ...clientaForm, telefono: e.target.value })
                    e.target.value
                }}
                w={"100%"}
                {...inputStyles}
                placeholder="Telefono/Celular"
            />
        </HStack>
    )
}

const inputStyles = {
    fontSize: "md",
    shadow: "sm",
    bg: "white"
}