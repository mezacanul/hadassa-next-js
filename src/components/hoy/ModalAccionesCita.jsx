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
    Switch,
    Badge,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import API from "@/services/main";
import { loadHook } from "@/utils/lattice-design";
import {
    addMinutesToTime,
    formatFechaYMD,
    formatHoyTitle,
} from "@/utils/main";
import {
    FaCheck,
    FaTimes,
    FaWhatsapp,
    FaMoneyBill,
    FaRegCheckCircle,
    FaCheckCircle,
} from "react-icons/fa";
import { TbCashRegister } from "react-icons/tb";
import { IoMdTime } from "react-icons/io";
import { IoPerson } from "react-icons/io5";
import StatusBadge from "../common/StatusBadge";
import { Form } from "react-bootstrap";
import CloseButton from "../common/CloseButton";
import { format } from "date-fns";
import whatsappUtils from "@/utils/whatsapp";
import { LuBed } from "react-icons/lu";

export default function ModalAccionesCita({
    open,
    setOpen,
    cita,
    setCita,
    servicios,
    citas,
    setCitas,
}) {
    const [currentView, setCurrentView] = useState(null);
    const [precios, setPrecios] = useState(null);

    useEffect(() => {
        if (open) {
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
    }, [open]);

    const handleConfirmarCita = () => {
        setCurrentView("loading");
        API.citas
            .confirmarCita(cita.cita_ID)
            .then((resp) => {
                console.log("confirmar cita:", resp);
                if (
                    resp.status == 200 &&
                    resp.data.affectedRows == 1
                ) {
                    setCurrentView("success");
                    setCita({ ...cita, status: 2 });
                    const updatedCitas = citas.map(
                        (citaObj) => {
                            if (
                                citaObj.cita_ID ===
                                cita.cita_ID
                            ) {
                                return {
                                    ...citaObj,
                                    status: 2,
                                };
                            }
                            return citaObj;
                        }
                    );
                    setCitas(updatedCitas);
                } else {
                    alert("Error al confirmar cita");
                    setCurrentView(null);
                }
            });
    };

    const handlePagarCita = async (mp, precio, citaID) => {
        try {
            const resp = await API.citas.pagarCita(
                citaID,
                mp,
                precio
            );

            console.log("pagar cita:", resp);
            const updatedCitas = citas.map((citaObj) => {
                if (citaObj.cita_ID === citaID) {
                    const updatedObj = {
                        ...citaObj,
                        status: 2,
                        pagado: 1,
                        metodo_pago: mp,
                        monto_pagado: precio,
                        fecha_pagado: format(
                            new Date(),
                            "yyyy-MM-dd HH:mm:ss"
                        ),
                    };
                    setCita(updatedObj);
                    return updatedObj;
                }
                return citaObj;
            });
            setCitas(updatedCitas);
            return { success: true };
        } catch (err) {
            console.log("error pagar cita:", err);
            alert("Error al pagar cita");
            return { success: false };
        }
    };

    const handleCancelarCita = async (cita) => {
        try {
            const resp = await API.citas.cancelCita(
                cita.cita_ID
            );

            console.log("cancelar cita:", resp);
            const updatedCitas = citas.filter((citaObj) => {
                return citaObj.cita_ID !== cita.cita_ID;
            });
            setCitas(updatedCitas);
            setCita({ ...cita, status: 0 });
            return { success: true };
        } catch (err) {
            alert("Error al cancelar cita");
            return { success: false };
        }
    };

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
                        <CloseButton
                            onClick={() => setOpen(false)}
                            size="lg"
                            position={{
                                top: "1rem",
                                right: "1rem",
                            }}
                        />
                        <Dialog.Header>
                            <HStack w={"100%"}>
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
                                    minH={"17rem"}
                                >
                                    <DetallesCita
                                        cita={cita}
                                    />

                                    {cita.pagado != 1 &&
                                        cita.status != 0 &&
                                        !currentView && (
                                            <AccionesCita
                                                cita={cita}
                                                setCurrentView={
                                                    setCurrentView
                                                }
                                                handleConfirmarCita={
                                                    handleConfirmarCita
                                                }
                                                servicios={
                                                    servicios
                                                }
                                            />
                                        )}

                                    {cita.pagado == 1 &&
                                        cita.status != 0 &&
                                        !currentView && (
                                            <PagadoView
                                                cita={cita}
                                                setCurrentView={
                                                    setCurrentView
                                                }
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
                                            handlePagarCita={
                                                handlePagarCita
                                            }
                                        />
                                    )}

                                    {currentView ==
                                        "cancelar" && (
                                        <CancelarView
                                            cita={cita}
                                            setCurrentView={
                                                setCurrentView
                                            }
                                            handleCancelarCita={
                                                handleCancelarCita
                                            }
                                        />
                                    )}

                                    {currentView ==
                                        "success" && (
                                        <Success
                                            message={
                                                "Cita Confirmada Exitosamente"
                                            }
                                            setCurrentView={
                                                setCurrentView
                                            }
                                        />
                                    )}

                                    {currentView ==
                                        "loading" && (
                                        <Loader />
                                    )}

                                    {cita.status == 0 &&
                                        !currentView && (
                                            <Text
                                                color={
                                                    "red.600"
                                                }
                                                textAlign={
                                                    "center"
                                                }
                                                w={"100%"}
                                                fontSize={
                                                    "lg"
                                                }
                                            >
                                                {
                                                    "Cita Cancelada"
                                                }
                                            </Text>
                                        )}
                                </Grid>

                                {cita.en_servicio == 1 && (
                                    <EnServicio />
                                )}
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

                <Text>
                    {formatHoyTitle(
                        formatFechaYMD(cita.fecha)
                    )}
                </Text>

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
                bg={"white"}
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

function AccionesCita({
    cita,
    setCurrentView,
    handleConfirmarCita,
    servicios,
}) {
    const buttonStyles = {
        fontWeight: 700,
        shadow: "sm",
        variant: "subtle",
    };
    const servicio = servicios.find(
        (servicioObj) => servicioObj.id === cita.servicio_id
    );

    const enviarConfirmacion = () => {
        whatsappUtils.copyMessage(
            {
                ...cita,
                precio: servicio.precio,
                precio_tarjeta: servicio.precio_tarjeta,
            },
            "confirmacion"
        );
        window.open(
            whatsappUtils.createWhatsAppUrl(cita),
            "_blank"
        );
    };

    const enviarRecordatorio = () => {
        whatsappUtils.copyMessage(
            {
                ...cita,
                precio: servicio.precio,
                precio_tarjeta: servicio.precio_tarjeta,
            },
            "recordatorio"
        );
        window.open(
            whatsappUtils.createWhatsAppUrl(cita),
            "_blank"
        );
    };
    return (
        <Grid
            gridTemplateColumns={"1fr 1fr"}
            gap={"1rem"}
            bg={"white"}
            h={"fit-content"}
        >
            {cita.status != 2 && (
                <Button
                    {...buttonStyles}
                    colorPalette={"blue"}
                    onClick={handleConfirmarCita}
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
                <>
                    <Button
                        {...buttonStyles}
                        colorPalette={"green"}
                        onClick={enviarConfirmacion}
                    >
                        <FaWhatsapp />
                        {"Confirmación"}
                    </Button>
                    <Button
                        {...buttonStyles}
                        colorPalette={"green"}
                        onClick={enviarRecordatorio}
                    >
                        <FaWhatsapp />
                        {"Recordatorio"}
                    </Button>
                </>
            )}

            <Button
                {...buttonStyles}
                colorPalette={"red"}
                onClick={() => setCurrentView("cancelar")}
            >
                <FaTimes />
                {"Cancelar Cita"}
            </Button>
        </Grid>
    );
}

function PagadoView({ cita, setCurrentView }) {
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

            <HStack>
                <Button
                    colorPalette={"red"}
                    variant={"outline"}
                    size={"sm"}
                    onClick={() =>
                        setCurrentView("cancelar")
                    }
                    mt={"1rem"}
                >
                    {"Cancelar Cita"}
                </Button>
            </HStack>
        </VStack>
    );
}

function CancelarView({
    cita,
    setCurrentView,
    handleCancelarCita,
}) {
    const [status, setStatus] = useState(null);

    const onCancelarCita = async () => {
        setStatus("loading");
        const resp = await handleCancelarCita(cita);
        setStatus(resp.success ? "success" : null);
    };

    return (
        <VStack
            h={"100%"}
            w={"100%"}
            alignItems={"center"}
            justifyContent={"center"}
            // shadow={"sm"}
            rounded={"lg"}
            borderColor={"black"}
            borderWidth={"2px"}
            position={"relative"}
        >
            <CloseButton
                onClick={() => setCurrentView(null)}
            />
            {status == "loading" && <Loader />}
            {status == "success" && (
                <Success
                    message={"Cita Cancelada Exitosamente"}
                    setCurrentView={setCurrentView}
                />
            )}
            {status == null && (
                <>
                    <Heading size={"lg"}>
                        {"Confirmar Cancelación"}
                    </Heading>
                    <Text
                        color={"red.600"}
                        mb={"1rem"}
                    >
                        {"No puedes revertir esta acción"}
                    </Text>
                    <Button
                        colorPalette={"red"}
                        variant={"subtle"}
                        onClick={onCancelarCita}
                        // onClick={() => setCurrentView(null)}
                    >
                        {"Cancelar Cita"}
                    </Button>
                </>
            )}
        </VStack>
    );
}

function PagarView({
    cita,
    precios,
    setCurrentView,
    handlePagarCita,
}) {
    const mps = ["efectivo", "tarjeta"];
    const [mp, setMp] = useState(null);
    const [status, setStatus] = useState(null);

    const onPagarCita = async () => {
        setStatus("loading");
        const resp = await handlePagarCita(
            mp,
            precios[mp],
            cita.cita_ID
        );
        setStatus(resp.success ? "success" : null);
    };

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
            {status == "loading" && <Loader />}
            {status == "success" && (
                <Success
                    message={"Cita Pagada Exitosamente"}
                    setCurrentView={setCurrentView}
                />
            )}
            {status == null && (
                <>
                    <Text>{"Pagar Cita"}</Text>
                    <Text
                        fontWeight={700}
                        fontSize={"md"}
                    >
                        {mp
                            ? `Costo: $${precios[mp]}`
                            : "--"}
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
                        onChange={(e) =>
                            setMp(e.target.value)
                        }
                    >
                        <option
                            // value={null}
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
                        onClick={onPagarCita}
                    >
                        {"Pagar"}
                    </Button>
                </>
            )}
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

function Success({ message, setCurrentView }) {
    return (
        <VStack
            justifyContent={"center"}
            alignItems={"center"}
            // py={"5rem"}
            w={"100%"}
            h={"100%"}
            gap={"1rem"}
        >
            <Text
                fontSize={"4xl"}
                color={"green.600"}
            >
                <FaRegCheckCircle />
            </Text>
            <Text
                w={"80%"}
                textAlign={"center"}
            >
                {message}
            </Text>
            <Button
                size={"sm"}
                colorPalette={"blue"}
                variant={"subtle"}
                onClick={() => setCurrentView(null)}
            >
                {"Cerrar"}
            </Button>
        </VStack>
    );
}

function EnServicio() {
    return (
        <HStack
            justifyContent={"center"}
            w={"100%"}
            mt={"2rem"}
            mb={"1rem"}
        >
            <Badge
                colorPalette={"green"}
                shadow={"sm"}
                px={"1rem"}
                py={"0.5rem"}
                rounded={"lg"}
            >
                <Text
                    fontSize={"2xl"}
                    // color={"pink.500"}
                    fontWeight={600}
                >
                    <LuBed />
                </Text>
                <Text
                    fontSize={"md"}
                    // color={"pink.500"}
                    fontWeight={600}
                >
                    {"Cita en servicio"}
                </Text>
            </Badge>
        </HStack>
    );
}
