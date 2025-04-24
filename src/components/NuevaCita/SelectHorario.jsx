import {
    Box,
    createListCollection,
    Heading,
    Portal,
    Select,
    Text,
    VStack,
} from "@chakra-ui/react";
import { RiCloseLargeLine } from "react-icons/ri";

import { useCurrentCita } from "@/pages/nueva-cita/[date]";
import RemoveButton from "../common/RemoveButton";

export default function SelectHorario() {
    const [currentCita] = useCurrentCita();

    if (currentCita.servicio != null && currentCita.lashista != null) {
        if (currentCita.horario == null) {
            return (
                <VStack w={"30rem"}>
                    <Heading
                        fontWeight={"300"}
                        mb={"1rem"}
                        size={"5xl"}
                        color={"pink.600"}
                    >
                        Horario
                    </Heading>

                    <HorarioSelect />
                </VStack>
            );
        } else {
            return <CurrentHorario />;
        }
    }
}

export function CurrentHorario() {
    const [currentCita, setCurrentCita] = useCurrentCita();

    if (currentCita.horario != null) {
        return (
            <VStack
                borderRadius={"1rem"}
                color={"white"}
                bg={"pink.600"}
                p={"2rem"}
                px={"4rem"}
                h={"100%"}
                position={"relative"}
                justify={"center"}
            >
                {/* CLose Button  */}
                <RemoveButton
                    onClick={() => {
                        setCurrentCita({ ...currentCita, horario: null });
                    }}
                />

                <Box textAlign={"center"} mt={"-1rem"}>
                    <Text>Horario:</Text>
                    <Heading size={"2xl"}>{currentCita.horario}</Heading>
                </Box>
            </VStack>
        );
    }
}

function HorarioSelect() {
    const [currentCita, setCurrentCita] = useCurrentCita();

    const horariosDisponibles = createListCollection({
        items: [
            { label: "09:00 a.m.", value: "09:00 am" },
            { label: "09:30 a.m.", value: "09:30 am" },
            { label: "10:00 a.m.", value: "10:00 am" },
            { label: "10:30 a.m.", value: "10:30 am" },
            { label: "11:00 a.m.", value: "11:00 am" },
            { label: "11:30 a.m.", value: "11:30 am" },
            { label: "12:00 p.m.", value: "12:00 pm" },
            { label: "12:30 p.m.", value: "12:30 pm" },
            { label: "13:00 p.m.", value: "13:00 pm" },
            { label: "13:30 p.m.", value: "13:30 pm" },
            { label: "14:00 p.m.", value: "14:00 pm" },
            { label: "14:30 p.m.", value: "14:30 pm" },
            { label: "15:00 p.m.", value: "15:00 pm" },
            { label: "15:30 p.m.", value: "15:30 pm" },
            { label: "16:00 p.m.", value: "16:00 pm" },
            { label: "16:30 p.m.", value: "16:30 pm" },
            { label: "17:00 p.m.", value: "17:00 pm" },
            { label: "17:30 p.m.", value: "17:30 pm" },
        ],
    });

    function handleSelectChange(e) {
        setCurrentCita({ ...currentCita, horario: e.target.value });
    }

    return (
        <Select.Root
            size={"lg"}
            collection={horariosDisponibles}
            w={"80%"}
            onChange={handleSelectChange}
            borderColor={"pink.500"}
            borderWidth={"1px"}
        >
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
