import {
    Button,
    Dialog,
    Text,
    Portal,
    VStack,
    Heading,
    Alert,
    Spinner,
    HStack,
    Box,
    Grid,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import API from "@/services/main";
import { loadHook } from "@/utils/lattice-design";
import {
    addMinutesToTime,
    formatHoyTitle,
} from "@/utils/main";
import {
    FaCheck,
    FaTimes,
    FaWhatsapp,
    FaMoneyBill,
    FaRegCheckCircle,
} from "react-icons/fa";
import { TbCashRegister } from "react-icons/tb";
import { IoMdTime } from "react-icons/io";
import { IoPerson } from "react-icons/io5";
import StatusBadge from "../common/StatusBadge";
import { Form } from "react-bootstrap";
import CloseButton from "../common/CloseButton";

export default function ModalAccionesCita({
    open,
    setOpen,
    cita,
    servicios,
}) {
    const [currentView, setCurrentView] = useState(null);
    const [precios, setPrecios] = useState(null);

    useEffect(() => {
        if (cita && servicios) {
            const servicio = servicios.find(
                (servicio) =>
                    servicio.id === cita.servicio_id
            );
            const preciosObj = {
                efectivo: servicio.precio,
                tarjeta: servicio.precio_tarjeta,
            };
            setCurrentView(null);
            setPrecios(preciosObj);
        }
    }, [cita, servicios]);

    return (
        <Dialog.Root
            placement="center"
            size={"lg"}
            lazyMount
            open={open}
            onOpenChange={(e) => setOpen(e.open)}
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <HStack
                                // justifyContent={
                                //     "space-between"
                                // }
                                w={"100%"}
                                // my={"0.2rem"}
                                // mx={"0.5rem"}
                            >
                                <Text
                                    fontSize={"lg"}
                                    fontWeight={600}
                                >
                                    {"Cita"}
                                </Text>
                            </HStack>
                        </Dialog.Header>

                        {cita && (
                            <Dialog.Body>
                                <Grid
                                    w={"100%"}
                                    gridTemplateColumns={
                                        "2fr 3fr"
                                    }
                                    gap={"2rem"}
                                    mb={"1rem"}
                                    px={"1rem"}
                                    py={"2rem"}
                                    minH={"15rem"}
                                >
                                    <DetallesCita
                                        cita={cita}
                                    />

                                    {cita.pagado != 1 &&
                                        !currentView && (
                                            <AccionesCita
                                                cita={cita}
                                                setCurrentView={
                                                    setCurrentView
                                                }
                                            />
                                        )}

                                    {cita.pagado == 1 &&
                                        !currentView && (
                                            <PagadoView
                                                cita={cita}
                                            />
                                        )}

                                    {currentView ==
                                        "pagar" && (
                                        <PagarView
                                            cita={cita}
                                            precios={
                                                precios
                                            }
                                            setCurrentView={
                                                setCurrentView
                                            }
                                        />
                                    )}
                                </Grid>
                            </Dialog.Body>
                        )}
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}

function DetallesCita({ cita }) {
    return (
        <VStack
            alignItems={"start"}
            justifyContent={"space-between"}
        >
            <VStack
                alignItems={"start"}
                gap={"0.5rem"}
                w={"100%"}
            >
                <HStack
                    // alignItems={"center"}
                    alignItems={"end"}
                    gap={"0.2rem"}
                >
                    <Text
                        fontWeight={700}
                        color={"blue.600"}
                        fontSize={"xl"}
                    >
                        <IoMdTime />
                    </Text>

                    <Text
                        fontWeight={700}
                        color={"blue.600"}
                        fontSize={"xl"}
                    >
                        {cita.hora}
                    </Text>

                    <Text fontSize={"sm"}>
                        {` - ${addMinutesToTime(
                            cita.hora,
                            cita.minutos
                        )}`}
                    </Text>
                </HStack>

                <HStack>
                    {/* <Text
                        fontWeight={600}
                        fontSize={"lg"}
                    >
                        <IoPerson />
                    </Text> */}
                    <Text
                        fontWeight={600}
                        fontSize={"lg"}
                    >
                        {cita.nombres} {cita.apellidos}
                    </Text>
                </HStack>

                <StatusBadge
                    status={cita.status}
                    pagado={cita.pagado}
                />
                {/* <Text>{`+${cita.lada} ${cita.telefono}`}</Text> */}
            </VStack>

            <VStack
                alignItems={"start"}
                gap={"0rem"}
                py={"0.5rem"}
                px={"1rem"}
                rounded={"lg"}
                // shadow={"sm"}
                borderColor={"pink.500"}
                borderWidth={"2px"}
                w={"100%"}
            >
                <Text
                    fontWeight={600}
                    fontSize={"md"}
                >
                    {cita.servicio}
                </Text>
                <Text
                    color={"pink.500"}
                    fontWeight={600}
                    // fontSize={"md"}
                >
                    {cita.lashista}
                </Text>
            </VStack>
        </VStack>
    );
}

function AccionesCita({ cita, setCurrentView }) {
    const buttonStyles = {
        fontWeight: 700,
        shadow: "sm",
        variant: "subtle",
    };
    return (
        <Grid
            gridTemplateColumns={"1fr 1fr"}
            gap={"1rem"}
            h={"fit-content"}
        >
            {cita.status != 2 && (
                <Button
                    {...buttonStyles}
                    colorPalette={"blue"}
                >
                    <FaCheck />
                    {"Confirmar Cita"}
                </Button>
            )}
            <Button
                {...buttonStyles}
                colorPalette={"blue"}
                onClick={() => setCurrentView("pagar")}
            >
                <TbCashRegister />
                {"Pagar"}
            </Button>
            {cita.status != 2 && (
                <Button
                    {...buttonStyles}
                    colorPalette={"green"}
                >
                    <FaWhatsapp />
                    {"Confirmación"}
                </Button>
            )}
            <Button
                {...buttonStyles}
                colorPalette={"green"}
            >
                <FaWhatsapp />
                {"Recordatorio"}
            </Button>
            <Button
                {...buttonStyles}
                colorPalette={"red"}
            >
                <FaTimes />
                {"Cancelar Cita"}
            </Button>
        </Grid>
    );
}

function PagadoView({ cita }) {
    return (
        <VStack
            h={"100%"}
            w={"100%"}
            alignItems={"center"}
            gap={"0.5rem"}
        >
            <Text
                color={"green.600"}
                fontSize={"4xl"}
            >
                <FaRegCheckCircle />
            </Text>
            <Text
                fontWeight={700}
                fontSize={"lg"}
            >{`Pagado: $${cita.monto_pagado}`}</Text>
            <HStack>
                <Text>{`Método de Pago: `}</Text>
                <Text
                    fontWeight={700}
                    color={
                        cita.metodo_pago == "tarjeta"
                            ? "blue.600"
                            : "green.600"
                    }
                >
                    {cita.metodo_pago}
                </Text>
            </HStack>
            <Text>{`Fecha: ${formatHoyTitle(
                cita.fecha_pagado
            )}`}</Text>
        </VStack>
    );
}

function PagarView({ cita, precios, setCurrentView }) {
    const mps = ["efectivo", "tarjeta"];
    const [mp, setMp] = useState(null);

    return (
        <VStack
            h={"100%"}
            w={"100%"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={"0.5rem"}
            // shadow={"sm"}
            rounded={"lg"}
            borderColor={"black"}
            borderWidth={"2px"}
            position={"relative"}
        >
            <CloseButton
                onClick={() => setCurrentView(null)}
            />
            <Text
                fontWeight={700}
                fontSize={"md"}
            >
                {mp ? `Costo: $${precios[mp]}` : "--"}
            </Text>
            <Form.Select
                style={{
                    width: "50%",
                    padding: "0.5rem",
                    fontSize: "0.9rem",
                    borderColor: "black",
                    borderWidth: "2px",
                    borderRadius: "0.3rem",
                }}
                value={mp}
                onChange={(e) => setMp(e.target.value)}
            >
                <option
                    value={null}
                    disabled
                    selected
                >
                    {"Método de pago"}
                </option>
                {mps.map((mp) => (
                    <option
                        key={mp}
                        value={mp}
                    >
                        {mp}
                    </option>
                ))}
            </Form.Select>
            <Button
                // variant={"subtle"}
                colorPalette={"green"}
                shadow={"sm"}
                w={"50%"}
                disabled={mp == null}
            >
                {"Pagar"}
            </Button>
        </VStack>
    );
}

function Loader() {
    return (
        <HStack
            justifyContent={"center"}
            alignItems={"center"}
            py={"5rem"}
            w={"100%"}
            h={"100%"}
        >
            <Spinner
                color="pink.500"
                borderWidth="4px"
                size={"xl"}
            />
        </HStack>
    );
}

function Success() {
    return (
        <HStack
            justifyContent={"center"}
            alignItems={"center"}
            py={"5rem"}
            w={"100%"}
            h={"100%"}
        >
            <Text
                fontSize={"xl"}
                fontWeight={"bold"}
                color={"green.600"}
            >
                {"Operación completada exitosamente"}
            </Text>
        </HStack>
    );
}
