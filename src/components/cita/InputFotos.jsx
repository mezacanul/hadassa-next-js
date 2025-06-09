import { Button, FileUpload, useFileUpload } from "@chakra-ui/react";
import { useEffect } from "react";
import { HiUpload } from "react-icons/hi";

export default function InputFotos({ handleFileChange, uploading }) {
    const fileUpload = useFileUpload({
        maxFiles: 1,
    });

    useEffect(() => {
        const accepted = fileUpload.acceptedFiles;
        handleFileChange(accepted); // Pass accepted files to parent
    }, [fileUpload, handleFileChange]);

    return (
        <FileUpload.RootProvider
            value={fileUpload}
            // accept={["image/jpeg", "image/png", "image/heic"]}
            accept={["image/jpeg", "image/png"]}
        >
            <FileUpload.HiddenInput />
            <FileUpload.Trigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    bg={"white"}
                    shadow={"sm"}
                    isDisabled={uploading}
                >
                    <HiUpload /> Seleccionar Foto
                </Button>
            </FileUpload.Trigger>
            <FileUpload.ItemGroup>
                <FileUpload.Items
                    bg={"white"}
                    shadow={"sm"}
                    clearable
                    showSize
                />
            </FileUpload.ItemGroup>
        </FileUpload.RootProvider>
    );
}
