"use client";
import {
    Button,
    Heading,
    VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { CDN } from "@/config/cdn";
import InputFotos from "@/components/cita/InputFotos";

export default function Dev() {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

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

        const formData = new FormData();
        files.forEach((file) => formData.append("fotoCejas", file)); // Match PHP field name

        try {
            const response = await axios.post(
                `${CDN}/uploadFotoCejas.php`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            console.log("Upload response:", response.data);
            setFiles([]);
        } catch (err) {
            console.error("Upload error:", err.response?.data || err.message);
            setUploadError(err.response?.data?.error || "Failed to upload");
        } finally {
            setUploading(false);
        }
    };

    return (
        <VStack>
            <Heading>Dev Space</Heading>
            <InputFotos handleFileChange={handleFileChange} uploading={uploading}/>
            <Button onClick={handleUpload} isLoading={uploading} mt={4} bg={"pink.500"}>
                Upload to CDN
            </Button>
            {uploadError && (
                <p style={{ color: "red" }}>Error: {uploadError}</p>
            )}
        </VStack>
    );
}