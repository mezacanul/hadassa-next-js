import { formatCamaID } from "@/utils/main";
import { createListCollection, Heading, Portal, Select, Spinner } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

export default function SelectCama({ 
    lashistaID, 
    camaID, 
    w = "100%", 
    setEnabled,
    cama,
    setCama
}) {
    const [camas, setCamas] = useState(null)

    useEffect(() => {
        console.log(lashistaID, camaID);

        axios.get(`/api/camas?lashista=${lashistaID}`)
            .then((axiosResp) => {
                let items = axiosResp.data.map((cama => {
                    return { label: formatCamaID(cama.id), value: cama.id }
                }))

                // console.log(camas);
                const camasCollection = createListCollection({ items });
                setCamas(camasCollection)
                setCama([camaID]);
            })
    }, []);

    return (
        <>
            {/* <Heading>Select Camas</Heading> */}
            {!camas && (
                <Spinner color={"pink.500"}/>
            )}
            {camas && cama && (
                <Select.Root
                    bg={"white"}
                    // mb={"0.5rem"}
                    collection={camas}
                    size="md"
                    shadow={"sm"}
                    width={w}
                    value={cama}
                    onValueChange={(e) => {
                        setCama(e.value);
                        setEnabled(true)
                    }}
                >
                    <Select.HiddenSelect />
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText placeholder={"Cama"} />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {camas.items.map((c) => (
                                    <Select.Item
                                        item={c}
                                        key={c.value}
                                    >
                                        {c.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>
            )}
        </>
    );
}