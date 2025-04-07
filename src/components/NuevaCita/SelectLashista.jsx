import { Button, Grid, Heading, Image, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { RiCloseLargeLine } from "react-icons/ri";

export default function SelectLashista() {
    const [showLashistas, setShowLashistas] = useState(true);
    const [currentLashista, setCurrentLashista] = useState(null);

    return (
        <VStack w={"100%"}>
            <Heading
                mb={"2.5rem"}
                fontWeight={"300"}
                size={"5xl"}
                color={"pink.700"}
            >
                Lashista
            </Heading>

            <CurrentLashista dataLashista={currentLashista} setShowLashistas={setShowLashistas} setCurrentLashista={setCurrentLashista}/>
            {showLashistas && (
                <ListaLashistas
                    setShowLashistas={setShowLashistas}
                    setCurrentLashista={setCurrentLashista}
                />
            )}
        </VStack>
    );
}

function CurrentLashista({ dataLashista, setCurrentLashista, setShowLashistas }) {
    function handleClose(e) {
        setCurrentLashista(null)
        setShowLashistas(true)
    }

    if (dataLashista != null) {
        return (
            <VStack
                align={"center"}
                // w={"100%"}
                px={"3rem"}
                py={"2rem"}
                bg={"pink.700"}
                gap={"2rem"}
                boxShadow={"0px 6px 7px rgba(136, 136, 136, 0.4)"}
                rounded={"xl"}
                color={"white"}
                position={"relative"}
            >
                {/* CLose Button  */}
                <Button
                    opacity={"0.7"}
                    color={"white"}
                    fontSize={"xl"}
                    position={"absolute"}
                    right={"0.1rem"}
                    top={"0.3rem"}
                    transition={"all ease 0.3s"}
                    onClick={handleClose}
                    _hover={{
                        opacity: 1,
                        cursor: "pointer",
                        transform: "scale(1.05)",
                    }}
                    bg={"transparent"}
                >
                    <RiCloseLargeLine />
                </Button>
                <Image
                    // me={"1rem"}
                    boxShadow={"-4px 4px 8px rgba(0,0,0,0.2)"}
                    borderRadius={"100%"}
                    objectFit={"cover"}
                    w={"8rem"}
                    src={`/img/lashistas/${dataLashista.image}`}
                />
                <Heading fontWeight={"300"} size={"2xl"}>
                    {dataLashista.nombre}
                </Heading>
            </VStack>
        );
    }
}

function ListaLashistas({ setShowLashistas, setCurrentLashista }) {
    const [lashistas, setLashistas] = useState([]);
    useEffect(() => {
        Promise.all([axios.get("/api/lashistas")]).then(([LashistaResp]) => {
            setLashistas(LashistaResp.data);
            // console.log("DB data:", LashistaResp.data);
        });
    }, []);

    return (
        <Grid templateColumns={"repeat(3, 1fr)"} w={"100%"}>
            {lashistas.map((lsh) => {
                return (
                    <Lashista
                        key={lsh.id}
                        data={lsh}
                        setShowLashistas={setShowLashistas}
                        setCurrentLashista={setCurrentLashista}
                    />
                );
            }, [])}
        </Grid>
    );
}

function Lashista({ data, setShowLashistas, setCurrentLashista }) {
    function handleSelectLashista(e) {
        setShowLashistas(false);
        setCurrentLashista(data);
        // console.log("test");
    }

    return (
        <VStack align={"center"} w={"100%"} gap={"2rem"}>
            <Image
                // me={"1rem"}
                boxShadow={"-4px 4px 8px rgba(0,0,0,0.2)"}
                borderRadius={"100%"}
                objectFit={"cover"}
                w={"8rem"}
                src={`/img/lashistas/${data.image}`}
            />
            <Button
                fontSize={"lg"}
                size={"lg"}
                // bg={"pink.500"}
                colorPalette={"pink"}
                onClick={handleSelectLashista}
            >
                {data.nombre}
            </Button>
        </VStack>
    );
}
