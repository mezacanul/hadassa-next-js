import {
    createListCollection,
    Heading,
    Portal,
    Select,
    Text,
    VStack,
} from "@chakra-ui/react";
import { RiCloseLargeLine } from "react-icons/ri";

import { useCitaPreview } from "@/pages/nueva-cita/[date]";

export default function SelectHorario() {
    const [citaPreview] = useCitaPreview();
    return (
        <VStack w={"100%"}>
            <Heading
                fontWeight={"300"}
                mb={"1rem"}
                size={"5xl"}
                color={"pink.600"}
            >
                Horario
            </Heading>

            <CurrentHorario />
            {citaPreview.horario == null && <HorarioSelect />}
        </VStack>
    );
}

function CurrentHorario() {
    const [citaPreview, setCitaPreview] = useCitaPreview();

    function handleClose(e) {
        setCitaPreview({ ...citaPreview, horario: null });
    }

    if (citaPreview.horario != null) {
        return (
            <Heading
                rounded={"lg"}
                color={"white"}
                bg={"pink.600"}
                p={"2rem"}
                px={"4rem"}
                position={"relative"}
            >
                {/* CLose Button  */}
                <Text
                    opacity={"0.7"}
                    color={"white"}
                    fontSize={"lg"}
                    position={"absolute"}
                    right={"0.7rem"}
                    top={"0.7rem"}
                    transition={"all ease 0.3s"}
                    onClick={handleClose}
                    _hover={{
                        opacity: 1,
                        cursor: "pointer",
                        transform: "scale(1.05)",
                    }}
                >
                    <RiCloseLargeLine />
                </Text>
                {citaPreview.horario}
            </Heading>
        );
    }
}

function HorarioSelect() {
    const [citaPreview, setCitaPreview] = useCitaPreview();

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
        setCitaPreview({...citaPreview, horario: e.target.value})
    }

    return (
        <Select.Root
            size={"lg"}
            collection={horariosDisponibles}
            w={"25%"}
            onChange={handleSelectChange}
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
