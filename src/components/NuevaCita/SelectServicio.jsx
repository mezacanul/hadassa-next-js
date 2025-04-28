import {
    Button,
    Grid,
    GridItem,
    Heading,
    HStack,
    Image,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import axios from "axios";
import { MdTimelapse } from "react-icons/md";

import { Singleton } from "@/utils/lattice-design";
import { useCurrentCita } from "@/pages/nueva-cita/[date]";
import RemoveButton from "../common/RemoveButton";

const useServicios = Singleton([]);

export default function SelectServicio() {
    const [currentCita] = useCurrentCita();

    if (currentCita.servicio == null) {
        return (
            <VStack>
                <Heading
                    my={"1rem"}
                    fontWeight={400}
                    mb={"0.5rem"}
                    size={"2xl"}
                    color={"pink.600"}
                    // fontStyle={"italic"}
                >
                    Seleccionar Servicio
                </Heading>

                <ListaServicios />
            </VStack>
        );
    }
}

export function CurrentServicio() {
    const [currentCita, setCurrentCita] = useCurrentCita();

    if (currentCita.servicio != null) {
        return (
            <HStack
                boxShadow={"0px 6px 7px rgba(136, 136, 136, 0.4)"}
                rounded={"xl"}
                px={"2rem"}
                py={"1rem"}
                w={"30rem"}
                h={"100%"}
                justify={"space-between"}
                align={"center"}
                bg={"pink.600"}
                position={"relative"}
            >
                {/* CLose Button  */}
                <RemoveButton
                    onClick={() => {
                        setCurrentCita({ ...currentCita, servicio: null });
                    }}
                />

                <Image
                    boxShadow={"-4px 4px 8px rgba(0,0,0,0.2)"}
                    borderRadius={"1.2rem"}
                    w={"8rem"}
                    src={`/img/servicios/${currentCita.servicio.image}`}
                    me={"1rem"}
                />

                {/* Descripcion  */}
                <VStack
                    color={"white"}
                    align={"start"}
                    gap={"0.3rem"}
                    w={"65%"}
                    h={"90%"}
                    justify={"space-between"}
                    // my={"2rem"}
                >
                    <VStack align={"start"}>
                        <Heading fontStyle={"italic"} t size={"3xl"}>
                            {currentCita.servicio.servicio}
                        </Heading>

                        <Text fontSize={"sm"} w={"80%"}>
                            {currentCita.servicio.descripcion}
                        </Text>
                    </VStack>

                    <VStack w={"100%"}>
                        <VStack align={"end"} alignSelf={"end"}>
                            <HStack textDecor={"underline"}>
                                <Text>
                                    <MdTimelapse />
                                </Text>
                                <Text fontWeight={500}>
                                    {currentCita.servicio.minutos} minutos
                                </Text>
                            </HStack>

                            <Text fontSize={"xl"} fontWeight={800}>
                                ${currentCita.servicio.precio}
                            </Text>
                        </VStack>
                    </VStack>
                </VStack>
            </HStack>
        );
    }
}

function ListaServicios() {
    const [servicios, setServicios] = useServicios();

    useEffect(() => {
        Promise.all([axios.get("/api/servicios")]).then(([serviciosResp]) => {
            setServicios(serviciosResp.data);
        });
    }, []);

    return (
        <Grid
            boxShadow={"-3px 3px 10px rgba(0,0,0,0.2)"}
            p={"1rem"}
            borderRadius={"2rem"}
            borderColor={"pink.500"}
            borderWidth={"2px"}
            height={"60vh"}
            overflowY={"scroll"}
            templateColumns={"repeat(2, 1fr)"}
            py={"2rem"}
            align={"start"}
            columnGap={"5rem"}
            rowGap={"3rem"}
        >
            {servicios.map((srv) => {
                return (
                    <GridItem key={srv.id}>
                        <Servicio data={srv} />
                    </GridItem>
                );
            }, [])}
        </Grid>
    );
}

function Servicio({ data }) {
    const [currentCita, setCurrentCita] = useCurrentCita();

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
            <HStack
                border={"2px solid rgb(228, 212, 227)"}
                rounded={"xl"}
                mt={"0.7rem"}
                w={"100%"}
                align={"center"}
                px={"1rem"}
            >
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

                    <Text color={"pink.800"} fontWeight={800}>
                        ${data.precio}
                    </Text>
                </VStack>

                <Button
                    size={"lg"}
                    onClick={() => {
                        setCurrentCita({ ...currentCita, servicio: data });
                    }}
                    colorPalette={"pink"}
                >
                    Seleccionar
                </Button>
            </HStack>
        </VStack>
    );
}
