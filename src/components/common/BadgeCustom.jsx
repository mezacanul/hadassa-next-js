import { Badge } from "@chakra-ui/react";
import { useState } from "react";
import { useEffect } from "react";

export default function BadgeCustom({ type, status }) {
    let [bagdeConfig, setBagdeConfig] = useState(null);

    useEffect(() => {
        const config = getBagdeConfig(type, status);
        setBagdeConfig(config);
    }, []);
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

function getBagdeConfig(type, value) {
    let colorPalette = null;
    let label = null;
    const statusConfig = {
        colorPalette: ["red", "yellow", "green"],
        label: ["Cancelada", "Pendiente", "Confirmada"],
    };

    if (type === "status") {
        colorPalette = statusConfig.colorPalette[value];
        label = statusConfig.label[value];
    }
    if (type === "pagado") {
        colorPalette = value === 1 ? "green" : "yellow";
        label = value === 1 ? "Pagado" : "Pendiente";
    }
    return {
        colorPalette,
        label,
    };
}
