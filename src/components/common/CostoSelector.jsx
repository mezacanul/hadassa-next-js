import { useState } from "react";
import { VStack, Text, HStack } from "@chakra-ui/react";
import {
    VscTriangleLeft,
    VscTriangleRight,
} from "react-icons/vsc";
import { FaTimes } from "react-icons/fa";

export default function CostoSelector({
    value,
    data,
    servicios,
}) {
    const [mp, setMp] = useState(null);
    const styles = {
        monto: {
            fontWeight: 600,
            lineHeight: "1",
        },
        metodoPago: {
            fontSize: "xs",
            lineHeight: "1",
            transition: "all 0.3s ease",
        },
    };

    return (
        <VStack
            justifyContent="center"
            h="100%"
        >
            {data.pagado && (
                <PriceTag
                    precio={value}
                    metodo_pago={data.metodo_pago}
                    styles={styles}
                />
            )}

            {!data.pagado && !mp && (
                <MetodoPagoSelector
                    setMp={setMp}
                    styles={styles}
                />
            )}

            {!data.pagado && mp && (
                <>
                    <PriceTag
                        precio={getServicioPrecio(
                            data.servicio_id,
                            servicios,
                            mp
                        )}
                        metodo_pago={mp}
                        styles={styles}
                        reset={true}
                        setMp={setMp}
                    />
                </>
            )}
        </VStack>
    );
}

function MetodoPagoSelector({ setMp, styles }) {
    return (
        <>
            <Text
                {...styles.metodoPago}
                _hover={{
                    transform: "scale(1.2)",
                }}
                cursor="pointer"
                color={`green`}
                onClick={() => {
                    setMp("efectivo");
                }}
            >{`Efectivo`}</Text>
            <Text
                {...styles.metodoPago}
                _hover={{
                    transform: "scale(1.2)",
                }}
                cursor="pointer"
                color={`blue.600`}
                onClick={() => {
                    setMp("tarjeta");
                }}
            >{`Tarjeta`}</Text>
        </>
    );
}

function PriceTag({
    precio,
    metodo_pago,
    styles,
    setMp,
    reset = false,
}) {
    return (
        <>
            <Text {...styles.monto}>{`$${precio}`}</Text>
            <HStack
                justifyContent="center"
                gap={0.5}
                alignItems="center"
            >
                {reset && (
                    <Text
                        cursor="pointer"
                        onClick={() => {
                            setMp(null);
                        }}
                        fontSize="0.6rem"
                        opacity="0.6"
                    >
                        <FaTimes />
                    </Text>
                )}
                <Text
                    {...styles.metodoPago}
                    color={
                        metodo_pago == "tarjeta"
                            ? "blue.600"
                            : "green"
                    }
                >
                    {metodo_pago}
                </Text>
            </HStack>
        </>
    );
}

function getServicioPrecio(
    servicio_id,
    servicios,
    metodo_pago
) {
    const servicio = servicios.find(
        (servicio) => servicio.id === servicio_id
    );
    switch (metodo_pago) {
        case "efectivo":
            return servicio.precio;
        case "tarjeta":
            return servicio.precio_tarjeta;
        default:
            return servicio.precio;
    }
}
