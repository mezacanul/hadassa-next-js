import { createListCollection, Heading, Portal, Select, Spinner } from "@chakra-ui/react";

export default function SelectEvento({
    w = "100%",
    setEnabled,
    tipoEvento,
    setTipoEvento
}) {
    const eventosCollection = createListCollection({
        items: [
            { label: "Horas Libres", value: "horas-libres" },
            { label: "Dia Libre", value: "dia-libre" },
            { label: "Temporada Libre", value: "temporada-libre" },
        ]
    })

    return (
        <Select.Root
            bg={"white"}
            // mb={"0.5rem"}
            collection={eventosCollection}
            size="md"
            shadow={"sm"}
            width={w}
            value={tipoEvento}
            onValueChange={(e) => {
                setTipoEvento(e.value);
                // setEnabled(true)
            }}
        >
            <Select.HiddenSelect />
            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText placeholder={"Tipo de Evento"} />
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content>
                        {eventosCollection.items.map((ev) => (
                            <Select.Item
                                item={ev}
                                key={ev.value}
                            >
                                {ev.label}
                                <Select.ItemIndicator />
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    );
}