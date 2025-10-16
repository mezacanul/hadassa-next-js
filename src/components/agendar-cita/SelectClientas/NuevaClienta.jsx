import { useCurrentCita } from "@/pages/nueva-cita/[date]";
import { format } from "date-fns";
import { useState, useMemo } from "react";
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
    setSearchTerm,
    setIsDuplicate,
    setIsEmpty,
    isDuplicate,
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

    const nombresClientas = useMemo(() => {
        return clientas.map(
            (clienta) =>
                `${clienta.nombres} ${clienta.apellidos}`
        );
    }, [clientas]);
    const telefonoClientas = useMemo(() => {
        return clientas.map(
            (clienta) =>
                `${clienta.lada} ${clienta.telefono}`
        );
    }, [clientas]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNuevaClienta((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAdd = () => {
        const isValid = validateClienta();
        if (!isValid) {
            return;
        }

        console.log(nuevaClienta);
        return axios
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

    const validateClienta = () => {
        // Verify if the clienta is empty
        if (
            !nuevaClienta.nombres ||
            !nuevaClienta.apellidos ||
            !nuevaClienta.lada ||
            !nuevaClienta.telefono
        ) {
            setIsEmpty(true);
            setSearchTerm("");
            setIsDuplicate(false);
            return false;
        }
        setIsEmpty(false);

        // Verify if the clienta's name is already in the list
        const nombreNuevaClienta = `${nuevaClienta.nombres} ${nuevaClienta.apellidos}`;
        if (nombresClientas.includes(nombreNuevaClienta)) {
            setIsDuplicate(true);
            setSearchTerm(nombreNuevaClienta);
            return false;
        }
        // Verify if the clienta's phone number is already in the list
        const telefonoNuevaClienta = `${nuevaClienta.lada} ${nuevaClienta.telefono}`;
        if (
            telefonoClientas.includes(telefonoNuevaClienta)
        ) {
            setIsDuplicate(true);
            setSearchTerm(telefonoNuevaClienta);
            return false;
        }
        // If the clienta is not in the list, reset search term and duplicate
        setIsDuplicate(false);
        setSearchTerm("");
        return true;
    };

    return (
        <>
            <ClientaCard
                data={nuevaClienta}
                currentPaso={currentPaso}
            />
            {!insertedID && (
                <ClientaForm
                    nuevaClienta={nuevaClienta}
                    setNuevaClienta={setNuevaClienta}
                    handleChange={handleChange}
                    handleAdd={handleAdd}
                    setClientasState={setClientasState}
                    setIsDuplicate={setIsDuplicate}
                    setSearchTerm={setSearchTerm}
                    isDuplicate={isDuplicate}
                    setIsEmpty={setIsEmpty}
                />
            )}
            {insertedID && (
                <SuccessAddedClienta
                    setCurrentPaso={setCurrentPaso}
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
    setIsDuplicate,
    setSearchTerm,
    isDuplicate,
    setIsEmpty,
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
            <PhoneInput
                clientaForm={nuevaClienta}
                setClientaForm={setNuevaClienta}
                fontSize={"sm"}
            />
            <HStack gap={"1rem"}>
                <Button
                    onClick={handleAdd}
                    bg={"pink.500"}
                    // disabled={isDuplicate}
                >
                    {"Agregar y Seleccionar"}
                </Button>
                <Button
                    onClick={() => {
                        setClientasState("buscar");
                        setIsDuplicate(false);
                        setIsEmpty(false);
                        setSearchTerm("");
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
