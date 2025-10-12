import { Alert } from "@chakra-ui/react";

export default function AlertEmptyClienta() {
    return (
        <Alert.Root
            status="error"
            w={"100%"}
            shadow={"md"}
            mb={"1rem"}
        >
            <Alert.Indicator />
            <Alert.Title>
                {"Debes llenar todos los campos"}
            </Alert.Title>
        </Alert.Root>
    );
}
