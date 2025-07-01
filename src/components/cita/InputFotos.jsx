import { Button, FileUpload, Float, Grid, useFileUpload } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { HiUpload } from "react-icons/hi";
import { LuX } from "react-icons/lu";

export default function InputFotos({ handleFileChange, uploading, uploadStatus = "iddle", maxFiles = 1 }) {
    const [acceptedFiles, setAcceptedFiles] = useState(0)
    const fileUpload = useFileUpload({
        maxFiles,
        accept: ["image/jpeg", "image/png"]
    })
    // const files = fileUpload.acceptedFiles

    useEffect(() => {
        if (uploadStatus == "success" || uploadStatus == "error") {
            fileUpload.clearFiles()
        }
    }, [uploadStatus])

    useEffect(() => {
        const accepted = fileUpload.acceptedFiles;
        handleFileChange(accepted); // Pass accepted files to parent
        setAcceptedFiles(accepted.length)
    }, [fileUpload, handleFileChange]);

    return (
        <FileUpload.RootProvider
            value={fileUpload}
        // accept={["image/jpeg", "image/png"]}
        // accept={["image/jpeg", "image/png", "image/heic"]}
        >
            <FileUpload.HiddenInput />
            <FileUpload.ItemGroup>
                <Grid gridTemplateColumns={maxFiles == 5 ? "1fr 1fr 1fr" : "1fr"} gap={"1rem"}>
                    <FileUpload.Context>
                        {({ acceptedFiles }) =>
                            acceptedFiles.map((file, i) => (
                                <FileUpload.Item
                                    key={i}
                                    file={file} w="auto"
                                    boxSize="7rem"
                                    p="2"
                                // clearable
                                // showSize
                                >
                                    <FileUpload.ItemPreviewImage />
                                    <Float placement="top-end">
                                        <FileUpload.ItemDeleteTrigger boxSize="4" layerStyle="fill.solid">
                                            <LuX />
                                        </FileUpload.ItemDeleteTrigger>
                                    </Float>
                                </FileUpload.Item>
                            ))
                        }
                    </FileUpload.Context>
                </Grid>
            </FileUpload.ItemGroup>
            {acceptedFiles < 5 && (
                <FileUpload.Trigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        bg={"white"}
                        shadow={"sm"}
                        isDisabled={uploading}
                    >
                        <HiUpload /> Seleccionar Fotos
                    </Button>
                </FileUpload.Trigger>
            )}
        </FileUpload.RootProvider>
    );
}
