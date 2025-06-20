import { useCita } from "@/pages/citas/[citaID]";
import { formatFechaDMY, formatHoyTitle } from "@/utils/main";
import { Badge, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { SelectMetodoPago, useMetodoPago } from "../agendar-cita/OrderSummary";

export default function DetallesTicket() {
    const [cita] = useCita();
    const [mp, setMp] = useMetodoPago();
    let statusBadgeColor;

    switch (cita.status) {
        case 1:
            statusBadgeColor = "yellow";
            break;
        case 2:
            statusBadgeColor = "green";
            break;
        case 0:
            statusBadgeColor = "red";
            break;
        default:
            break;
    }

    return (
        <VStack w={"100%"} gap={"1rem"}>
            <HStack w={"100%"} justify={"space-between"}>
                <Text>Fecha:</Text>
                <Text fontWeight={800}>
                    {formatHoyTitle(formatFechaDMY(cita.fecha))}
                </Text>
            </HStack>

            <HStack w={"100%"} justify={"space-between"}>
                <Text>Hora:</Text>
                <Text fontWeight={800}>{cita.hora}</Text>
            </HStack>

            <HStack w={"100%"} justify={"space-between"}>
                <Text>Precio:</Text>
                <Text fontWeight={800}>
                    ${mp == "efectivo" ? cita.precio : cita.precio_tarjeta}
                </Text>
            </HStack>

            <HStack w={"100%"} justify={"space-between"}>
                <Text>Estado:</Text>
                <Text fontWeight={800}>
                    <Badge
                        p={"0.5rem"}
                        fontWeight={700}
                        fontSize={"0.9rem"}
                        colorPalette={statusBadgeColor}
                    >
                        {cita.status == 2 && "Confirmada"}
                        {cita.status == 1 && "Pendiente"}
                        {cita.status == 0 && "Cancelada"}
                    </Badge>
                </Text>
            </HStack>

            <HStack w={"100%"} justify={"space-between"}>
                <Text>Pagado:</Text>
                <Text fontWeight={800}>
                    <Badge
                        p={"0.5rem"}
                        fontWeight={700}
                        fontSize={"0.9rem"}
                        colorPalette={cita.pagado == 1 ? "green" : "yellow"}
                    >
                        {cita.pagado == 1 ? "Pagado" : "Pendiente"}
                    </Badge>
                </Text>
            </HStack>

            <HStack w={"100%"} justify={"space-between"}>
                <Text>Método de Pago:</Text>
                <SelectMetodoPago value={cita.metodo_pago} w={"12rem"} />
            </HStack>
        </VStack>
    );
}
