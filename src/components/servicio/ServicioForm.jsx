import { Badge, Button, Heading, HStack, Input, Spinner, Text, Textarea, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { FaCreditCard, FaMoneyBill } from "react-icons/fa";


export default function ServicioForm({ servicio, setTitle }) {
    const reglasAgenda = JSON.parse(servicio.reglas_agenda)
    const [actualizarStatus, setActualizarStatus] = useState("iddle")
    const [servicioForm, setServicioForm] = useState({
        title: servicio.servicio,
        descripcion: servicio.descripcion,
        minutos: servicio.minutos,
        precio: servicio.precio,
        precioTarjeta: servicio.precio_tarjeta,
        // directiva: servicio.reglas_agenda,
        // tipo: servicio.tipo
    })

    // const actualizarServicio = () => {
    //     setActualizarStatus("updating")
    //     setActualizarStatus("success")
    //     console.log(servicioForm);
    // }

    const actualizarServicio = () => {
        // setActualizarStatus("updating")

        setActualizarStatus("updating")
        // setActualizarStatus("success")
        // console.log(servicioForm);
        // return
        // console.log(servicioForm);
        axios
            .patch(`/api/servicios/${servicio.id}`, {
                type: "batch",
                payload: servicioForm
            })
            .then((axiosResp) => {
                console.log(axiosResp.data);
                // return
                const resp = axiosResp.data
                if (resp.success && resp.affectedRows == 1) {
                    setActualizarStatus("success");
                    setTitle(servicioForm.title)
                }
            })
            .catch((err) => {
                console.log(err);
                setActualizarStatus("error");
            })
    }

    return (
        <VStack alignItems={"start"} gap={"1.5rem"} w={"70%"}>
            {/* <Heading>{servicio.id}</Heading> */}

            <HStack gap={"1rem"}>
                <Badge
                    fontSize={"0.9rem"}
                    shadow={"sm"}
                    fontWeight={700}
                    colorPalette={
                        servicio.tipo == "default" && "blue" ||
                        servicio.tipo == "combo" && "purple" ||
                        servicio.tipo == "combo-hadassa" && "pink"
                    }
                    px={"0.5rem"}
                    py={"0.4rem"}
                >
                    Servicio
                    {servicio.tipo == "default" && " Default"}
                    {servicio.tipo == "combo" && " Combo"}
                    {servicio.tipo == "combo-hadassa" && " Combo Hadassa"}
                </Badge>

                <Badge
                    fontSize={"0.9rem"}
                    shadow={"sm"}
                    fontWeight={700}
                    colorPalette={
                        reglasAgenda[0] == -1 && "blue" ||
                        reglasAgenda[0] == 0 && "purple" ||
                        reglasAgenda[0] == 1 && "orange"
                    }
                    px={"0.5rem"}
                    py={"0.4rem"}
                >
                    {reglasAgenda[0] == -1 && "Puede agendar especial"}
                    {reglasAgenda[0] == 0 && "Especial"}
                    {reglasAgenda[0] == 1 && "No agenda especial"}
                </Badge>
            </HStack>


            <VStack w={"80%"}>
                <Input
                    disabled={actualizarStatus == "updating" ? true : false}
                    type="text"
                    value={servicioForm.title}
                    onChange={(e) => {
                        setServicioForm({ ...servicioForm, title: e.target.value })
                    }}
                    {...inputStyles}
                />
                <Textarea
                    disabled={actualizarStatus == "updating" ? true : false}
                    h={"8rem"}
                    value={servicioForm.descripcion}
                    onChange={(e) => {
                        setServicioForm({ ...servicioForm, descripcion: e.target.value })
                    }}
                    {...inputStyles}
                />
            </VStack>

            <HStack gap={"2rem"}>
                <VStack alignItems={"start"}>
                    <Heading size={"md"}>Duración:</Heading>
                    <HStack>
                        <Input
                            disabled={actualizarStatus == "updating" ? true : false}
                            w={"5rem"}
                            textAlign={"center"}
                            // type="text"
                            value={servicioForm.minutos}
                            onChange={(e) => {
                                setServicioForm({ ...servicioForm, minutos: e.target.value })
                            }}
                            {...inputStyles}
                            
                            type="number"
                            step={30} // Sets arrow increment to 30
                            min={30}
                            max={240} // Optional max (e.g., 4 hours)
                        />
                        <Text>minutos</Text>
                    </HStack>
                </VStack>

                <VStack alignItems={"start"}>
                    <Heading size={"md"}>Precio:</Heading>
                    <HStack gap={"2rem"}>
                        <HStack alignItems={"center"}>
                            <Heading size={"4xl"} color={"green"}>
                                <FaMoneyBill />
                            </Heading>
                            <Heading size={"md"}>$</Heading>
                            {/* <Text>$</Text> */}
                            <Input
                                disabled={actualizarStatus == "updating" ? true : false}
                                w={"6rem"}
                                textAlign={"center"}
                                type="text"
                                value={servicioForm.precio}
                                onChange={(e) => {
                                    setServicioForm({ ...servicioForm, precio: e.target.value })
                                }}
                                {...inputStyles}
                            />
                        </HStack>
                        <HStack alignItems={"center"}>
                            <Heading size={"3xl"} color="blue.700">
                                <FaCreditCard />
                            </Heading>
                            <Heading size={"md"}>$</Heading>
                            {/* <Text>$</Text> */}
                            <Input
                                disabled={actualizarStatus == "updating" ? true : false}
                                w={"6rem"}
                                textAlign={"center"}
                                type="text"
                                value={servicioForm.precioTarjeta}
                                onChange={(e) => {
                                    setServicioForm({ ...servicioForm, precioTarjeta: e.target.value })
                                }}
                                {...inputStyles}
                            />
                        </HStack>
                    </HStack>
                </VStack>
            </HStack>

            <HStack gap={"1rem"} w={"100%"}>
                {actualizarStatus != "updating" && <Button onClick={actualizarServicio} fontWeight={800} shadow={"md"} variant={"outline"} colorPalette={"blue"}>Actualizar Datos</Button>}
                {actualizarStatus == "success" && <Text color={"green"}>¡Servicio Actualizado Exitosamente!</Text>}
                {actualizarStatus == "error" && <Text color={"red"}>Error al actualizar</Text>}
            </HStack>
            {actualizarStatus == "updating" && <Spinner size={"lg"} borderWidth={"3px"} color={"blue.600"} />}
        </VStack>
    )
}

const inputStyles = {
    fontSize: "md",
    shadow: "sm",
    bg: "white"
}