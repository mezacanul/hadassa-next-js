import { useCurrentCita } from "@/pages/nueva-cita/[date]";
import {
    loadHook,
    Singleton,
} from "@/utils/lattice-design";
import {
    formatHoyTitle,
    getDateObject,
} from "@/utils/main";
import {
    Alert,
    Badge,
    Button,
    createListCollection,
    Heading,
    HStack,
    Portal,
    Select,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import {
    FaRegClock,
    FaRegSquareMinus,
} from "react-icons/fa6";
import { IoPersonOutline } from "react-icons/io5";
import {
    LuBedSingle,
    LuCalendar1,
    LuReceiptText,
} from "react-icons/lu";
import { PiCashRegisterBold } from "react-icons/pi";
import { sortHours } from "@/utils/disponibilidad";
import { parse, format } from "date-fns";
import { es } from "date-fns/locale";
import { RiDiscountPercentLine } from "react-icons/ri";
import { IoIosStar } from "react-icons/io";
import { useRouter as useNextNav } from "next/navigation";

export const useMetodoPago = Singleton(null);
export const useAgendarLoading = Singleton(null);
export const useCitaID = Singleton(null);

export default function OrderSummary({
    disabled,
    setCurrentPaso,
    setClientasState,
    dateObj,
}) {
    const [citaID, setCitaID] = useCitaID();
    const [mp, setMp] = useMetodoPago();
    const [agendarLoading, setAgendarLoading] =
        useAgendarLoading();
    // const [selectedDate, setSelectedDate] = loadHook("useSelectedDate");
    const [currentCita, setCurrentCita] = useCurrentCita();
    const [tieneDescuento, setTieneDescuento] =
        useState(null);
    const [loadingDescuentos, setLoadingDescuentos] =
        useState(false);
    const NextNav = useNextNav();

    useEffect(() => {
        if (currentCita.clienta) {
            setLoadingDescuentos(true);
            const send = {
                clienta: currentCita.clienta.id,
                servicio: currentCita.servicio.id,
            };
            console.log(send);
            axios
                .post("/api/descuentos", send)
                .then((axiosResp) => {
                    console.log(axiosResp);
                    const total = axiosResp.data.length;
                    const newTotal = total + 1;
                    // console.log(newTotal % 6 === 0);

                    setTieneDescuento({
                        aplica:
                            newTotal % 6 === 0
                                ? true
                                : false,
                        total: axiosResp.data.length,
                    });
                    setLoadingDescuentos(false);
                });
        } else {
            setTieneDescuento(null);
        }
    }, [currentCita.clienta]);

    const handleAgendar = () => {
        setAgendarLoading(true);
        console.log({
            ...currentCita,
            metodoPago: mp[0],
            action: "agendar",
        });
        // return

        axios
            .post("/api/citas", {
                ...currentCita,
                metodoPago: mp[0],
                action: "agendar",
            })
            .then((citasResp) => {
                console.log(citasResp);
                if (
                    citasResp.status == 201 &&
                    citasResp.data.uuid
                ) {
                    setCitaID(citasResp.data.uuid);
                    setAgendarLoading(false);
                }
            });
    };

    const handleCurrentStage = (stage) => {
        switch (stage) {
            case "Servicio":
                // setMp([])
                setClientasState("buscar");
                setCurrentCita({
                    ...currentCita,
                    servicio: null,
                    lashista: null,
                    horario: null,
                    clienta: null,
                });
                break;
            case "Lashista":
                setClientasState("buscar");
                setCurrentCita({
                    ...currentCita,
                    lashista: null,
                    horario: null,
                    clienta: null,
                });
                break;
            case "Horario":
                setClientasState("buscar");
                setCurrentCita({
                    ...currentCita,
                    horario: null,
                    clienta: null,
                });
                break;
            case "Clienta":
                setClientasState("buscar");
                setCurrentCita({
                    ...currentCita,
                    clienta: null,
                });
                break;
            default:
                break;
        }
        setCurrentPaso(stage);
        console.log(stage);
    };

    return (
        <VStack
            style={{
                width: currentCita.clienta ? "50%" : "35%",
            }}
            bg={"white"}
            p={"2rem"}
            shadow={"md"}
        >
            <Heading color={"pink.600"}>Resumen</Heading>

            <VStack
                w={"100%"}
                align={"start"}
                gap={"1.5rem"}
                mt={"1rem"}
                mb={"2rem"}
            >
                <HStack
                    w={"100%"}
                    justify={"space-between"}
                >
                    <HStack>
                        <LuCalendar1 />
                        <Text>Fecha: </Text>
                    </HStack>
                    <Text
                        textAlign={"right"}
                        textDecor={"underline"}
                        fontWeight={700}
                        color={"pink.600"}
                    >
                        {/* {selectedDate && formatFechaDMY(selectedDate)} */}
                        {/* {selectedDate && formatHoyTitle(selectedDate)} */}
                        {dateObj &&
                            `${dateObj.dayName} de ${dateObj.monthYearFormat}`}
                    </Text>
                </HStack>

                <HStack
                    w={"100%"}
                    justify={"space-between"}
                >
                    <HStack>
                        <LuReceiptText />
                        <Text>Servicio: </Text>
                    </HStack>
                    <HStack>
                        {!citaID &&
                            currentCita.servicio && (
                                <Text
                                    _hover={{
                                        cursor: "pointer",
                                    }}
                                >
                                    <FaRegSquareMinus
                                        onClick={() => {
                                            handleCurrentStage(
                                                "Servicio"
                                            );
                                        }}
                                    />
                                </Text>
                            )}
                        <Text
                            textAlign={"right"}
                            textDecor={
                                currentCita.servicio
                                    ? "underline"
                                    : "none"
                            }
                            fontWeight={700}
                            color={"pink.600"}
                        >
                            {currentCita.servicio
                                ? currentCita.servicio
                                      .servicio
                                : "--"}
                        </Text>
                    </HStack>
                </HStack>

                <HStack
                    w={"100%"}
                    justify={"space-between"}
                >
                    <HStack>
                        <LuBedSingle />
                        <Text>Lashista: </Text>
                    </HStack>
                    <HStack>
                        {!citaID &&
                            currentCita.lashista && (
                                <Text
                                    _hover={{
                                        cursor: "pointer",
                                    }}
                                >
                                    <FaRegSquareMinus
                                        onClick={() => {
                                            handleCurrentStage(
                                                "Lashista"
                                            );
                                        }}
                                    />
                                </Text>
                            )}
                        <Text
                            textDecor={
                                currentCita.lashista
                                    ? "underline"
                                    : "none"
                            }
                            fontWeight={700}
                            color={"pink.600"}
                        >
                            {currentCita.lashista
                                ? currentCita.lashista
                                      .nombre
                                : "--"}
                        </Text>
                    </HStack>
                </HStack>

                <HStack
                    w={"100%"}
                    justify={"space-between"}
                >
                    <HStack>
                        <FaRegClock />
                        <Text>Hora: </Text>
                    </HStack>
                    <HStack>
                        {!citaID && currentCita.horario && (
                            <Text
                                _hover={{
                                    cursor: "pointer",
                                }}
                            >
                                <FaRegSquareMinus
                                    onClick={() => {
                                        handleCurrentStage(
                                            "Horario"
                                        );
                                    }}
                                />
                            </Text>
                        )}
                        <Text
                            textDecor={
                                currentCita.horario
                                    ? "underline"
                                    : "none"
                            }
                            fontWeight={700}
                            color={"pink.600"}
                        >
                            {currentCita.horario
                                ? currentCita.horario.hora
                                      .replace("+", "*")
                                      .replace("-", "*")
                                : "--"}
                        </Text>
                    </HStack>
                </HStack>

                <HStack
                    w={"100%"}
                    justify={"space-between"}
                >
                    <HStack>
                        <IoPersonOutline />
                        <Text>Clienta: </Text>
                    </HStack>
                    <HStack
                        w={"100%"}
                        justifyContent={"end"}
                    >
                        {!citaID && currentCita.clienta && (
                            <Text
                                _hover={{
                                    cursor: "pointer",
                                }}
                            >
                                <FaRegSquareMinus
                                    onClick={() => {
                                        handleCurrentStage(
                                            "Clienta"
                                        );
                                    }}
                                />
                            </Text>
                        )}
                        <Text
                            textAlign={"right"}
                            maxWidth={"75%"}
                            // truncate
                            textDecor={
                                currentCita.clienta
                                    ? "underline"
                                    : "none"
                            }
                            fontWeight={700}
                            color={"pink.600"}
                        >
                            {currentCita.clienta
                                ? `${currentCita.clienta.nombres} ${currentCita.clienta.apellidos}`
                                : "--"}
                        </Text>
                    </HStack>
                </HStack>

                <HStack
                    w={"100%"}
                    justify={"space-between"}
                >
                    <HStack>
                        <RiDiscountPercentLine />
                        <Text>Tiene Descuento: </Text>
                    </HStack>
                    <HStack>
                        {loadingDescuentos && (
                            <Spinner color={"pink.500"} />
                        )}
                        <Text
                            textAlign={"right"}
                            // w={"85%"}
                            truncate
                            fontWeight={700}
                            color={"pink.600"}
                        >
                            {!tieneDescuento &&
                                !loadingDescuentos &&
                                "--"}
                            {tieneDescuento &&
                                tieneDescuento.aplica ==
                                    false &&
                                `No Aplica (${tieneDescuento.total} servicios)`}
                        </Text>
                        {tieneDescuento &&
                            tieneDescuento.aplica && (
                                <Badge
                                    shadow={"sm"}
                                    variant={"solid"}
                                    colorPalette={"purple"}
                                    px={"1rem"}
                                    py={"0.2rem"}
                                >
                                    {`SI (${tieneDescuento.total} Servicios) `}
                                    <IoIosStar />
                                </Badge>
                            )}
                    </HStack>
                </HStack>

                <HStack
                    w={"100%"}
                    justify={"space-between"}
                >
                    <HStack>
                        <PiCashRegisterBold />
                        <Text>Total: </Text>
                    </HStack>
                    <Text
                        textDecor={
                            currentCita.servicio && mp
                                ? "underline"
                                : "none"
                        }
                        fontWeight={700}
                        color={"pink.600"}
                    >
                        {currentCita.servicio &&
                            mp == "efectivo" &&
                            `$${currentCita.servicio.precio}`}
                        {currentCita.servicio &&
                            mp == "tarjeta" &&
                            `$${currentCita.servicio.precio_tarjeta}`}
                        {!mp && "--"}
                    </Text>
                </HStack>
            </VStack>

            <SelectMetodoPago citaID={citaID} />
            <CitaExito />
            {!citaID && agendarLoading != true && (
                <Button
                    // disabled={mp == []  ? false : true}
                    disabled={
                        mp?.length == 0 || mp == null
                            ? true
                            : false
                    }
                    onClick={handleAgendar}
                    size={"lg"}
                    bg={"pink.500"}
                    w={"100%"}
                >
                    Confirmar y Agendar
                </Button>
            )}

<style>
    {`
        .link-to:hover {
            cursor: pointer;
        }
    `}
</style>
            {citaID && (
                <Heading
                    className="link-to"
                    fontWeight={500}
                    textDecor={"underline"}
                    size={"lg"}
                    mt={"1rem"}
                    onClick={() => {
                        NextNav.push(`/citas/${citaID}`);
                    }}
                >
                    Ir a Cita
                </Heading>
            )}
        </VStack>
    );
}

export function SelectMetodoPago({
    w = "100%",
    value = null,
    citaID = null,
}) {
    const [mp, setMp] = useMetodoPago();

    useEffect(() => {
        if (value) {
            setMp([value]);
        }
    }, []);

    const metodosPago = createListCollection({
        items: [
            { label: "Efectivo", value: "efectivo" },
            { label: "Tarjeta", value: "tarjeta" },
        ],
    });

    return (
        <Select.Root
            disabled={citaID ? true : false}
            bg={"white"}
            mb={"0.5rem"}
            collection={metodosPago}
            size="md"
            width={w}
            value={mp ? mp : ""}
            onValueChange={(e) => {
                setMp(e.value);
            }}
        >
            <Select.HiddenSelect />
            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText placeholder="Metodo de Pago" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content>
                        {metodosPago.items.map(
                            (metodoPago) => (
                                <Select.Item
                                    item={metodoPago}
                                    key={metodoPago.value}
                                >
                                    {metodoPago.label}
                                    <Select.ItemIndicator />
                                </Select.Item>
                            )
                        )}
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    );
}

function CitaExito() {
    const [agendarLoading] = useAgendarLoading();

    return (
        <VStack
            gap={"1rem"}
            align={"center"}
            w={"100%"}
        >
            {agendarLoading == true && (
                <Spinner
                    size={"md"}
                    color={"pink.500"}
                />
            )}
            {agendarLoading == false && (
                <>
                    <Alert.Root
                        status="success"
                        w={"100%"}
                        shadow={"md"}
                        textAlign={"center"}
                    >
                        <Alert.Indicator />
                        <Alert.Title>
                            ¡Cita Agendada Exitosamente!
                        </Alert.Title>
                    </Alert.Root>
                    {/* <Button colorPalette={"green"}>
                        Enviar Ticket
                        <BsWhatsapp />
                    </Button> */}
                </>
            )}
        </VStack>
    );
}
