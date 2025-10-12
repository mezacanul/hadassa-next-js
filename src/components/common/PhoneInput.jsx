import { Heading, HStack, Input } from "@chakra-ui/react";

export default function PhoneInput({
    clientaForm,
    setClientaForm,
    w = "100%",
    fontSize = "md",
}) {
    return (
        <HStack w={w}>
            <Heading>+</Heading>
            <Input
                onChange={(e) => {
                    const value = e.target.value;
                    const lastChar = value.slice(-1);
                    if (lastChar === " ") return;
                    setClientaForm({
                        ...clientaForm,
                        lada: value.slice(0, 3),
                    });
                }}
                value={clientaForm.lada}
                w={"20%"}
                {...inputStyles}
                fontSize={fontSize}
                placeholder="Lada"
            />
            <Input
                value={clientaForm.telefono}
                onChange={(e) => {
                    const value = e.target.value;
                    const lastChar =
                        e.target.value.slice(-1);
                    if (lastChar === " ") return;
                    setClientaForm({
                        ...clientaForm,
                        telefono: value.slice(0, 10),
                    });
                }}
                w={"100%"}
                {...inputStyles}
                fontSize={fontSize}
                placeholder="Telefono/Celular"
            />
        </HStack>
    );
}

const inputStyles = {
    shadow: "sm",
    bg: "white",
};
