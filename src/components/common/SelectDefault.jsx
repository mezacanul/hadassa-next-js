import { Portal, Select } from "@chakra-ui/react";

export function SelectDefault({ value, setValue }) {
    // const [mp, setMp] = useMetodoPago();

    useEffect(() => {
    }, []);

    const opciones = createListCollection({
        items: [
            { label: "Test 1", value: "test-1" },
            { label: "Test 2", value: "test-2" },
        ],
    });

    return (
        <Select.Root
            // disabled={citaID ? true : false}
            bg={"white"}
            mb={"0.5rem"}
            collection={opciones}
            size="md"
            // width={w}
            value={value}
            onValueChange={(e) => {
                setValue(e.value);
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
                        {opciones.items.map((opcion, idx) => (
                            <Select.Item
                                item={opcion}
                                key={opcion.value}
                            >
                                {opcion.label}
                                <Select.ItemIndicator />
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    );
}