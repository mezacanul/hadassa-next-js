import { Badge } from "@chakra-ui/react";
import { useState } from "react";
import { useEffect } from "react";

export default function StatusBadge({ status, pagado }) {
    let [bagdeConfig, setBagdeConfig] = useState(null);

    useEffect(() => {
        const config = getBagdeConfig(status, pagado);
        setBagdeConfig(config);
    }, [status, pagado]);
    return (
        <>
            {bagdeConfig && (
                <Badge
                    shadow={"sm"}
                    fontWeight={600}
                    colorPalette={bagdeConfig.colorPalette}
                >
                    {bagdeConfig.label}
                </Badge>
            )}
        </>
    );
}

function getBagdeConfig(status, pagado) {
    let config = {
        label: "Not a value",
        colorPalette: "red",
    };
    switch (pagado) {
        case null:
            if (status == 0) {
                config = {
                    label: "Cancelada",
                    colorPalette: "red",
                };
            } else if (status == 1) {
                config = {
                    label: "Pendiente",
                    colorPalette: "yellow",
                };
            } else if (status == 2) {
                config = {
                    label: "Confirmada",
                    colorPalette: "blue",
                };
            }
            break;
        case 1:
            if (status == 0) {
                config = {
                    label: "Cancelada",
                    colorPalette: "red",
                };
            } else {
                config = {
                    label: "Pagado",
                    colorPalette: "green",
                };
            }
            break;
        default:
            break;
    }
    return config;
}
