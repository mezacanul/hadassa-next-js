import { Button, Heading, HStack, Spinner, Text, Textarea, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

export default function DescripcionCejas({ clientaID, detalles }) {
    const [loadingActualizacion, setLoadingActualizacion] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(null);
    const [enableActualizar, setEnableActualizar] = useState(false);
    const [detallesCejas, setDetallesCejas] = useState(detalles);
    
    function actualizarDetallesCejas() {
        setLoadingActualizacion(true);
        axios
            .patch(`/api/clientas/${clientaID}`, {
                column: "detalles_cejas",
                value: detallesCejas,
            })
            .then((clientaResp) => {
                console.log(clientaResp);
                const resp = clientaResp.data;
                console.log("clienta", clientaID);
                console.log("texto", detallesCejas);

                if (resp.success && resp.affectedRows == 1) {
                    setUpdateSuccess(true);
                    setEnableActualizar(false);
                } else {
                    alert("Error");
                }
                setLoadingActualizacion(false);
            });
    }

    return (
        <>
            <VStack alignItems={"start"} w={"100%"}>
                <Heading>Descripción:</Heading>
                <Textarea
                    h={"10rem"}
                    shadow={"sm"}
                    bg={"white"}
                    w={"70%"}
                    value={detallesCejas ? detallesCejas : ""}
                    onChange={(e) => {
                        setEnableActualizar(true);
                        setDetallesCejas(e.target.value);
                    }}
                />
            </VStack>

            {
                !loadingActualizacion && (
                    <HStack gap={"1.5rem"}>
                        <Button
                            colorPalette={"blue"}
                            shadow={"sm"}
                            variant={"subtle"}
                            fontWeight={700}
                            disabled={enableActualizar ? false : true}
                            onClick={actualizarDetallesCejas}
                        >
                            Actualizar Descripción
                        </Button>
                        {updateSuccess && (
                            <Text color={"green"}>¡Actualizado exitosamente!</Text>
                        )}
                    </HStack>
                )
            }
            {
                loadingActualizacion && (
                    <Spinner borderWidth={"3px"} size={"lg"} color={"blue.500"} />
                )
            }
        </>
    )
}
