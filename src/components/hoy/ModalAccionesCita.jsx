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
import { formatHoyTitle } from "@/utils/main";
import {
    FaCheck,
    FaTimes,
    FaWhatsapp,
    FaMoneyBill,
} from "react-icons/fa";
import { TbCashRegister } from "react-icons/tb";
import { IoMdTime } from "react-icons/io";
import { IoPerson } from "react-icons/io5";
import StatusBadge from "../common/StatusBadge";

export default function ModalAccionesCita({
    open,
    setOpen,
    cita,
}) {
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
                                justifyContent={
                                    "space-between"
                                }
                                w={"100%"}
                                m={"0.7rem"}
                            >
                                <Text
                                    fontSize={"md"}
                                    fontWeight={600}
                                >
                                    {"Cita"}
                                </Text>

                                {cita && (
                                    <StatusBadge
                                        status={cita.status}
                                        pagado={cita.pagado}
                                    />
                                )}
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
                                    mb={"4rem"}
                                    px={"1rem"}
                                    py={"2rem"}
                                >
                                    <DetallesCita
                                        cita={cita}
                                    />

                                    {cita.pagado != 1 && (
                                        <AccionesCita
                                            cita={cita}
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
            >
                <HStack
                    alignItems={"center"}
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
                </HStack>

                <HStack>
                    <Text
                        fontWeight={600}
                        fontSize={"lg"}
                    >
                        <IoPerson />
                    </Text>
                    <Text
                        fontWeight={600}
                        fontSize={"lg"}
                    >
                        {cita.nombres} {cita.apellidos}
                    </Text>
                </HStack>
                {/* <Text>{`+${cita.lada} ${cita.telefono}`}</Text> */}
            </VStack>

            <VStack
                alignItems={"start"}
                gap={"0rem"}
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

function AccionesCita({ cita }) {
    const buttonStyles = {
        fontWeight: 700,
        shadow: "sm",
        variant: "subtle",
    };
    return (
        <Grid
            gridTemplateColumns={"1fr 1fr"}
            gap={"1rem"}
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
