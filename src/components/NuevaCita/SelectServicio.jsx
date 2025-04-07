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
import { useEffect, useState } from "react";
import axios from "axios";
import { MdTimelapse } from "react-icons/md";
import { RiCloseLargeLine } from "react-icons/ri";

export default function SelectServicio() {
    const [currentServicio, setCurrentServicio] = useState(null);
    const [showServicios, setShowServicios] = useState(true);

    return (
        <VStack>
            <Heading
                fontWeight={"300"}
                my={"1rem"}
                size={"5xl"}
                color={"pink.700"}
            >
                Servicio
            </Heading>

            <CurrentServicio
                dataServicio={currentServicio}
                setCurrentServicio={setCurrentServicio}
                setShowServicios={setShowServicios}
            />

            {showServicios && (
                <ListaServicios
                    setShowServicios={setShowServicios}
                    setCurrentServicio={setCurrentServicio}
                />
            )}
        </VStack>
    );
}

function CurrentServicio({ dataServicio, setCurrentServicio, setShowServicios }) {
    function handleClose(e) {
        setCurrentServicio(null)
        setShowServicios(true)
    }

    if (dataServicio != null) {
        return (
            <HStack
                boxShadow={"0px 6px 7px rgba(136, 136, 136, 0.4)"}
                rounded={"xl"}
                p={"2rem"}
                w={"35rem"}
                justify={"space-between"}
                align={"center"}
                bg={"pink.700"}
                position={"relative"}
            >
                {/* CLose Button  */}
                <Text
                    opacity={"0.7"}
                    color={"white"}
                    fontSize={"xl"}
                    position={"absolute"}
                    right={"1rem"}
                    top={"1rem"}
                    transition={"all ease 0.3s"}
                    onClick={handleClose}
                    _hover={{
                        opacity: 1,
                        cursor:"pointer",
                        transform: "scale(1.05)"
                    }}
                >
                    <RiCloseLargeLine />
                </Text>

                <Image
                    boxShadow={"-4px 4px 8px rgba(0,0,0,0.2)"}
                    borderRadius={"1.2rem"}
                    w={"9rem"}
                    src={`/img/servicios/${dataServicio.image}`}
                />

                {/* Descripcion  */}
                <VStack
                    color={"white"}
                    align={"start"}
                    gap={"0.3rem"}
                    w={"65%"}
                >
                    <Heading fontStyle={"italic"}t size={"3xl"}>{dataServicio.servicio}</Heading>

                    <Text fontSize={"sm"}>{dataServicio.descripcion}</Text>

                    <VStack align={"end"} alignSelf={"end"} mt={"2rem"}>
                        <HStack textDecor={"underline"}>
                            <Text>
                                <MdTimelapse />
                            </Text>
                            <Text fontWeight={500}>
                                {dataServicio.minutos} minutos
                            </Text>
                        </HStack>

                        <Text fontSize={"xl"} fontWeight={800}>
                            ${dataServicio.precio}
                        </Text>
                    </VStack>
                </VStack>

                {/* <VStack
                    // mt={"0.5rem"}
                    p={"0.7rem"}
                    // borderTop={"1px solid rgba(0,0,0,0.1)"}
                    w={"100%"}
                    align={"start"}
                    gap={"0.2rem"}
                >
                    
                </VStack> */}
            </HStack>
        );
    }
}

function ListaServicios({ setShowServicios, setCurrentServicio }) {
    const [servicios, setServicios] = useState([]);

    useEffect(() => {
        Promise.all([axios.get("/api/servicios")]).then(([serviciosResp]) => {
            setServicios(serviciosResp.data);
            // console.log("DB data:", serviciosResp.data);
        });
    }, []);

    return (
        <Grid
            templateColumns={"repeat(3, 1fr)"}
            py={"2rem"}
            align={"start"}
            gap={"6rem"}
        >
            {servicios.map((srv) => {
                return (
                    <GridItem key={srv.id}>
                        <Servicio
                            data={srv}
                            setShowServicios={setShowServicios}
                            setCurrentServicio={setCurrentServicio}
                        />
                    </GridItem>
                );
            }, [])}
        </Grid>
    );
}

function Servicio({ data, setShowServicios, setCurrentServicio }) {
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
                        setCurrentServicio(data);
                        setShowServicios(false);
                    }}
                    colorPalette={"pink"}
                >
                    Seleccionar
                </Button>
            </HStack>
        </VStack>
    );
}
