import { Heading, HStack, Input } from "@chakra-ui/react"

export default function PhoneInput({ clientaForm, setClientaForm, w = "100%" }) {
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