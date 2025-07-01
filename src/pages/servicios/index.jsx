import { loadHook } from "@/utils/lattice-design";
import { Badge, Box, Button, Heading, HStack, Image, Table, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaClock } from "react-icons/fa6";
import { useRouter as useNextNav } from "next/navigation";
import { CDN } from "@/config/cdn";

export default function Servicios() {
    const [servicios, setServicios] = useState(null);
    const [loading, setLoading] = loadHook("useLoader");

    useEffect(() => {
        axios.get("/api/servicios").then((serviciosResp) => {
            console.log(serviciosResp.data);
            setServicios(serviciosResp.data);
            setLoading(false)
        });
    }, []);

    return (
        <Box w={"80%"}>
            {servicios && <ServiciosTable servicios={servicios} />}
        </Box>
    );
}

function ServiciosTable({ servicios }) {
    return (
        <Table.Root
            size="md"
            // striped
            variant={"outline"}
            bg={"white"}
            // w={"70%"}
            m={"auto"}
        >
            <Table.Header>
                <Table.Row bg={"pink.500"}>
                    <Table.ColumnHeader color={"white"}>
                        {/* <HStack justify={"center"}>
                            <AiFillPicture size={"1.5rem"} />
                        </HStack> */}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color={"white"}>
                        Servicio
                    </Table.ColumnHeader>
                    {/* <Table.ColumnHeader color={"white"}>
                        Descripcion
                    </Table.ColumnHeader> */}
                    <Table.ColumnHeader color={"white"}>
                        Duración
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color={"white"}>
                        Precio
                    </Table.ColumnHeader>
                    <Table.ColumnHeader color={"white"} textAlign={"end"} pe={"2rem"}>
                        Directiva
                    </Table.ColumnHeader>
                    {/* <Table.ColumnHeader color={"white"}>
                        Acciones
                    </Table.ColumnHeader> */}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {servicios.map((servicio, i) => (
                    <ServicioRow key={i} servicio={servicio} />
                ))}
            </Table.Body>
        </Table.Root>
    );
}

function ServicioRow({ servicio }) {
    const reglasAgenda = JSON.parse(servicio.reglas_agenda)
    const [loading, setLoading] = loadHook("useLoader");
    const NextNav = useNextNav();

    return (
        <Table.Row
            _hover={{
                bg: "pink.100",
                textDecor: "underline",
                cursor: "pointer",
            }}
            onClick={() => {
                setLoading(true)
                NextNav.push(`/servicios/${servicio.id}`)
            }}
        >
            <Table.Cell py={"1.5rem"}>
                <Image
                    // py={"1rem"}
                    w={"150px"}
                    rounded={"lg"}
                    src={`${CDN}/img/servicios/${servicio.image}`}
                />
            </Table.Cell>
            <Table.Cell>
                <Heading overflow={"hidden"} w={"12rem"} size={"lg"} color={"pink.700"}>
                    {servicio.servicio}
                </Heading>
            </Table.Cell>
            {/* <Table.Cell>{servicio.descripcion}</Table.Cell> */}
            <Table.Cell>
                <HStack gap={2} w={"7rem"}>
                    <Heading size={"md"} color="pink.600">
                        <FaClock />
                    </Heading>
                    {`${servicio.minutos} mins.`}
                </HStack>
            </Table.Cell>
            <Table.Cell fontWeight={600}>
                <VStack alignItems={"start"} me={"1.5rem"}>
                    <Text color={"green"}>{`$${servicio.precio}`}</Text>
                    <Text color={"blue.600"}>{`$${servicio.precio_tarjeta}`}</Text>
                </VStack>
            </Table.Cell>
            <Table.Cell>
                <HStack fontSize={"1rem"} justifyContent={"end"} me={"1rem"}>
                    <Badge
                        fontWeight={700}
                        colorPalette={
                            reglasAgenda[0] == -1 && "blue" ||
                            reglasAgenda[0] == 0 && "purple" ||
                            reglasAgenda[0] == 1 && "orange"
                        }
                        px={"0.5rem"}
                        py={"0.2rem"}
                    >
                        {reglasAgenda[0] == -1 && "Puede agendar especial"}
                        {reglasAgenda[0] == 0 && "Especial"}
                        {reglasAgenda[0] == 1 && "No agenda especial"}
                    </Badge>
                </HStack>
            </Table.Cell>
            {/* <Table.Cell>
                <Button bg={"pink.500"}>Editar</Button>
            </Table.Cell> */}
        </Table.Row>
    );
}
