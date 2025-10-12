import { Alert } from "@chakra-ui/react";

export default function AlertDuplicateClienta() {
    return (
        <Alert.Root
            status="warning"
            w={"100%"}
            shadow={"md"}
            mb={"1rem"}
        >
            <Alert.Indicator />
            <Alert.Title>
                {"La clienta ya existe"}
            </Alert.Title>
        </Alert.Root>
    );
}
