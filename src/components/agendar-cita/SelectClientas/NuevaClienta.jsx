import { useCurrentCita } from "@/pages/nueva-cita/[date]";
import { format } from "date-fns";
import { useState } from "react";
import {
    Button,
    Input,
    HStack,
    VStack,
    Alert,
} from "@chakra-ui/react";
import axios from "axios";
import { ClientaCard } from "./ClientaCard";
import { loadHook } from "@/utils/lattice-design";
import PhoneInput from "@/components/common/PhoneInput";

export default function NuevaClienta({
    setClientasState,
    setCurrentPaso,
    currentPaso,
}) {
    const [insertedID, setInsertedID] = useState(null);
    const [currentCita, setCurrentCita] = useCurrentCita();
    const [nuevaClienta, setNuevaClienta] = useState({
        foto_clienta: null,
        nombres: "",
        apellidos: "",
        lada: "52",
        telefono: "",
    });
    const [clientas, setClientas] = loadHook("useClientas");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNuevaClienta((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAdd = () => {
        console.log(nuevaClienta);
        axios
            .post("/api/clientas", nuevaClienta)
            .then((nuevaClientaResp) => {
                console.log(nuevaClientaResp.data);
                if (
                    nuevaClientaResp.status == 201 &&
                    nuevaClientaResp.data.uuid
                ) {
                    const nuevaClientaData = {
                        ...nuevaClienta,
                        id: nuevaClientaResp.data.uuid,
                        detalles_cejas: null,
                        fecha_agregado: format(
                            new Date(),
                            "yyyy-MM-dd HH:mm:ss"
                        ),
                        fecha_de_nacimiento: null,
                        fotos_cejas: null,
                    };

                    setInsertedID(
                        nuevaClientaResp.data.uuid
                    );
                    setCurrentCita({
                        ...currentCita,
                        clienta: {
                            ...nuevaClienta,
                            id: nuevaClientaResp.data.uuid,
                        },
                    });

                    const sortedClientas = [
                        ...clientas,
                        nuevaClientaData,
                    ].sort((a, b) => {
                        const fullNameA = `${a.nombres} ${a.apellidos}`;
                        const fullNameB = `${b.nombres} ${b.apellidos}`;
                        return fullNameA.localeCompare(
                            fullNameB
                        );
                    });
                    setClientas(sortedClientas);
                }
            });
    };

    return (
        <>
            <ClientaCard
                data={nuevaClienta}
                currentPaso={currentPaso}
            />
            {insertedID && (
                <SuccessAddedClienta
                    setCurrentPaso={setCurrentPaso}
                />
            )}
            {!insertedID && (
                <ClientaForm
                    nuevaClienta={nuevaClienta}
                    setNuevaClienta={setNuevaClienta}
                    handleChange={handleChange}
                    handleAdd={handleAdd}
                    setClientasState={setClientasState}
                />
            )}
        </>
    );
}

function ClientaForm({
    nuevaClienta,
    setNuevaClienta,
    handleChange,
    handleAdd,
    setClientasState,
}) {
    return (
        <VStack
            gap={"1rem"}
            align={"start"}
        >
            <Input
                bg={"white"}
                shadow={"md"}
                name="nombres" // Added name attribute
                value={nuevaClienta.nombres}
                onChange={handleChange}
                placeholder="Nombres"
            />
            <Input
                bg={"white"}
                shadow={"md"}
                name="apellidos" // Added name attribute
                value={nuevaClienta.apellidos}
                onChange={handleChange}
                placeholder="Apellidos"
            />
            {/* <HStack gap={"1rem"}>
                <Input
                    bg={"white"}
                    shadow={"md"}
                    name="lada" // Added name attribute
                    w={"25%"}
                    value={nuevaClienta.lada}
                    onChange={handleChange}
                    placeholder="Lada"
                />
                <Input
                    bg={"white"}
                    shadow={"md"}
                    name="telefono" // Added name attribute
                    value={nuevaClienta.telefono}
                    onChange={handleChange}
                    placeholder="Telefono/Celular"
                />
            </HStack> */}
            <PhoneInput
                clientaForm={nuevaClienta}
                setClientaForm={setNuevaClienta}
                fontSize={"sm"}
            />
            <HStack gap={"1rem"}>
                <Button
                    onClick={handleAdd}
                    bg={"pink.500"}
                >
                    {"Agregar y Seleccionar"}
                </Button>
                <Button
                    onClick={() => {
                        setClientasState("buscar");
                    }}
                    bg={"gray.500"}
                >
                    {"Cancelar"}
                </Button>
            </HStack>
        </VStack>
    );
}

function SuccessAddedClienta({ setCurrentPaso }) {
    return (
        <VStack
            gap={"1rem"}
            align={"start"}
            w={"100%"}
        >
            <Alert.Root
                status="success"
                w={"100%"}
                shadow={"md"}
            >
                <Alert.Indicator />
                <Alert.Title>
                    {"Clienta Agregada con Exito!"}
                </Alert.Title>
            </Alert.Root>
            <Button
                onClick={() => {
                    setCurrentPaso("Confirmar");
                }}
                bg={"pink.500"}
            >
                {"Continuar"}
            </Button>
        </VStack>
    );
}
