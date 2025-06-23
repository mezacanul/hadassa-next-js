import { Button, HStack, Input, Spinner, Text } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import PhoneInput from "../common/PhoneInput";

export default function DatosForm({ clienta, setFullNombre }) {
    const [actualizarStatus, setActualizarStatus] = useState("iddle")
    const [clientaForm, setClientaForm] = useState({
        nombres: clienta.nombres,
        apellidos: clienta.apellidos,
        lada: clienta.lada,
        telefono: clienta.telefono
    })

    const handleActualizarDatos = () => {
        setActualizarStatus("updating")
        // return
        console.log(clientaForm);
        axios
            .patch(`/api/clientas/${clienta.id}`, {
                type: "batch",
                payload: clientaForm
            })
            .then((axiosResp) => {
                console.log(axiosResp);
                const resp = axiosResp.data
                if (resp.success && resp.affectedRows == 1) {
                    setActualizarStatus("success");
                    setFullNombre(`${clientaForm.nombres} ${clientaForm.apellidos}`)
                }
            })
            .catch((err) => {
                console.log(err);
                setActualizarStatus("error");
            })
    }

    return (
        <>
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
            <PhoneInput clientaForm={clientaForm} setClientaForm={setClientaForm}/>

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
        </>
    )
}

const inputStyles = {
    fontSize: "md",
    shadow: "sm",
    bg: "white"
}