import ListaServicios from "@/components/ListaServicios";
import ListaClientas from "@/components/ListaClientas";
import {
    Box,
    Button,
    Grid,
    GridItem,
    Heading,
    Input,
    Portal,
    Select,
    VStack,
    createListCollection
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import ListaLashistas from "@/components/ListaLashistas";

export default function NuevaCita() {
    const router = useRouter();
    const { date } = router.query;
    const [showClientas, setShowClientas] = useState(true);
    const [showServicios, setShowServicios] = useState(true);
    const [showLashistas, setShowLashistas] = useState(false);
    const [showHorarios, setShowHorarios] = useState(false);

    return (
        <Box mx={"3rem"} py={"3rem"} mb="3rem">
            {/* Titulo  */}
            <VStack align={"start"} mb={"3rem"}>
                <Heading fontWeight={"300"} size={"5xl"}>
                    Agendar Cita:
                </Heading>
                <Heading
                    textDecor={"underline"}
                    size={"2xl"}
                    fontWeight={"light"}
                    fontStyle={"italic"}
                >
                    {date}
                </Heading>
            </VStack>

            {/* Lista de Opciones  */}
            <VStack gap={"6rem"}>
                {/* Opcion de Servicios  */}
                <VStack >
                    <Heading fontWeight={"300"} my={"1rem"} size={"5xl"} color={"pink.600"}>
                        Servicio
                    </Heading>
                    {showServicios && (
                        <ListaServicios setShowServicios={setShowServicios} />
                    )}
                </VStack>

                {/* Opcion de Lashistas  */}
                <VStack w={"100%"}>
                    <Heading
                        mb={"2.5rem"}
                        fontWeight={"300"}
                        size={"5xl"}
                        color={"pink.600"}
                    >
                        Lashista
                    </Heading>
                    <ListaLashistas />
                </VStack>

                {/* Opcion de Horarios  */}
                <VStack w={"100%"}>
                    <Heading fontWeight={"300"} mb={"1rem"} size={"5xl"} color={"pink.600"}>
                        Horario
                    </Heading>
                    <HorarioSelect/>
                </VStack>

                {/* Opcion de Clienta  */}
                <VStack gap={"2rem"}>
                    <Heading fontWeight={300} mb={"1rem"} size={"5xl"} color={"pink.600"}>
                        Clienta
                    </Heading>
                    <Input placeholder="Buscar" />
                    <ListaClientas />
                    <Heading>
                        (* agregar opcion/formulario de nueva clienta)
                    </Heading>
                    {/* <Heading>Nombre Apellido</Heading> */}
                </VStack>

                <Button
                    // disabled
                    fontSize={"xl"}
                    size={"xl"}
                    colorPalette={"pink"}
                >
                    Agendar Nueva Cita
                </Button>
            </VStack>
        </Box>
    );
}

function HorarioSelect() {
    const horariosDisponibles = createListCollection({
        items: [
          { label: "09:00 a.m.", value: "09.00" },
          { label: "09:30 a.m.", value: "09.30" },
          { label: "10:00 a.m.", value: "10.00" },
          { label: "10:30 a.m.", value: "10.30" },
        ],
      })

    return (
        <Select.Root size={"lg"} collection={horariosDisponibles} w={"25%"}>
            <Select.HiddenSelect />
            {/* <Select.Label>size = {size}</Select.Label> */}
            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText placeholder="Seleccionar Horario:" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content>
                        {horariosDisponibles.items.map((horario) => (
                            <Select.Item item={horario} key={horario.value}>
                                {horario.label}
                                <Select.ItemIndicator />
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    );
}
