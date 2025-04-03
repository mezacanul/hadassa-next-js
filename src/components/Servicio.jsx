import {
    Box,
    Button,
    Heading,
    HStack,
    Image,
    Link,
    Text,
    VStack,
} from "@chakra-ui/react";
import { Children, useEffect } from "react";
import { TfiTime } from "react-icons/tfi";
import { MdTimelapse } from "react-icons/md";

export default function Servicio({ data, setShowServicios }) {
    // const imgSrc = data.tipo != "combo-hadassa" ? data.id : "combo-hadassa";

    return (
        <VStack>
            <HStack w={"100%"} align={"start"}>
                <Image
                    me={"1rem"}
                    boxShadow={"-2px 2px 8px rgba(0,0,0,0.3)"}
                    borderRadius={"1.2rem"}
                    w={"6rem"}
                    src={`/img/servicios/${data.image}`}
                />

                {/* Descripcion  */}
                <VStack align={"start"} gap={0} w={"100%"}>
                    <Heading color={"pink.250"}>{data.servicio}</Heading>
                    <Text>{data.descripcion}</Text>
                </VStack>
            </HStack>

            {/* Precio y Duración */}
            <HStack border={"2px solid rgb(228, 212, 227)"} rounded={"xl"} mt={"0.7rem"} w={"100%"} align={"center"} px={"1rem"}>
                <VStack
                    // mt={"0.5rem"}
                    p={"0.7rem"}
                    // borderTop={"1px solid rgba(0,0,0,0.1)"}
                    w={"100%"}
                    align={"start"}
                    gap={"0.2rem"}
                >
                    <HStack color={"pink.800"} gap={1} textDecor={"underline"}>
                        <Text fontWeight={500}>{data.minutos} minutos</Text>
                        <Text>
                            <MdTimelapse />
                        </Text>
                    </HStack>

                    <Text color={"pink.800"} fontWeight={800}>${data.precio}</Text>
                </VStack>

                <Button size={"lg"} onClick={()=>{setShowServicios(false)}} colorPalette={"pink"}>Seleccionar</Button>
                
            </HStack>
        </VStack>
    );
}
