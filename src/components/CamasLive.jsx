import {
    Box,
    Text,
    HStack,
    VStack,
    Button,
    Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuBed } from "react-icons/lu";
import { MdOutlineChair } from "react-icons/md";
import { IoReload } from "react-icons/io5";
import API from "@/services/main";
import { mapLiveFeed } from "@/utils/main";

export default function CamasLive() {
    const [isLoading, setIsLoading] = useState(false);
    const [liveFeed, setLiveFeed] = useState({
        sillas: [],
        camas: [],
    });

    useEffect(() => {
        onReload();
    }, []);

    const updateLiveFeed = (data) => {
        setIsLoading(true);
        try {
            const payload = {
                id: data.id,
                status: data.active ? 0 : 1,
            };
            API.live.update(payload).then((updatedResp) => {
                console.log("updatedResp", updatedResp);

                const mappedUpdatedResp = mapLiveFeed(
                    updatedResp.data
                );

                setLiveFeed(mappedUpdatedResp);
                setIsLoading(false);
            });
        } catch (error) {
            console.error(
                "Error updating live feed:",
                error
            );
            setIsLoading(false);
        }
    };

    function onReload() {
        setIsLoading(true);
        API.live.getAll().then((liveResp) => {
            const mappedLiveFeed = mapLiveFeed(
                liveResp.data
            );
            console.log("mappedLiveFeed", mappedLiveFeed);
            setLiveFeed(mappedLiveFeed);
            setIsLoading(false);
        });
    }

    return (
        <Box w="100%">
            <Text
                fontSize={"xl"}
                mb="1.5rem"
            >
                {"Lugares Disponibles"}
            </Text>

            <HStack
                w={"100%"}
                bg="white"
                borderRadius="md"
                p="1rem"
                shadow="md"
                position="relative"
                h="20vh"
            >
                <VStack
                    h="100%"
                    justifyContent="space-around"
                >
                    {liveFeed.sillas.map((silla) => (
                        <LugarBtn
                            key={silla.id}
                            type="sillas"
                            data={silla}
                            updateLiveFeed={updateLiveFeed}
                        />
                    ))}
                </VStack>
                <HStack
                    justify="space-around"
                    px="1rem"
                    w="100%"
                >
                    {liveFeed.camas.map((cama) => (
                        <LugarBtn
                            key={cama.id}
                            type="camas"
                            data={cama}
                            updateLiveFeed={updateLiveFeed}
                        />
                    ))}
                </HStack>

                <BtnActualizar onReload={onReload} />
                <OverlayActualizar isLoading={isLoading} />
            </HStack>

            {/* <HStack py="1rem" px="0.5rem" gap="1.5rem">
                <HStack>
                    <Box
                        w="1rem"
                        h="1rem"
                        bg="gray.400"
                    />
                    <Text fontSize={"sm"}>
                        {"Disponible"}
                    </Text>
                </HStack>
                <HStack>
                    <Box
                        w="1rem"
                        h="1rem"
                        bg="pink.500"
                    />
                    <Text fontSize={"sm"}>{"Ocupado"}</Text>
                </HStack>
            </HStack> */}
        </Box>
    );
}

function OverlayActualizar({ isLoading }) {
    return (
        <Box
            display={isLoading ? "flex" : "none"}
            position="absolute"
            right="0"
            top="0"
            w="100%"
            h="100%"
            bg="rgba(255, 255, 255, 0.3)"
            zIndex="1000"
            justifyContent="end"
            alignItems="end"
            borderRadius="md"
            p="0.8rem"
        >
            <Spinner
                size="md"
                borderWidth="4px"
                color="blue.500"
            />
        </Box>
    );
}

function BtnActualizar({ onReload }) {
    return (
        <Button
            // variant="subtle"
            // colorPalette="green"
            bg="pink.500"
            color="white"
            fontWeight="bold"
            size="2xs"
            // fontSize="1rem"
            // p="0.rem"
            position="absolute"
            right="0"
            top="0"
            margin="0.7rem"
            onClick={onReload}
        >
            <Text fontSize="1.2rem">
                <IoReload />
            </Text>
        </Button>
    );
}

function LugarBtn({ type, data, updateLiveFeed }) {
    return (
        <Text
            color={data.active ? "pink.500" : "green.400"}
            style={{
                ...styles.btn,
                fontSize:
                    type == "sillas" ? "2rem" : "3rem",
            }}
            _hover={{
                transform: "scale(1.1)",
            }}
            onClick={() => updateLiveFeed(data)}
        >
            {type == "sillas" ? (
                <MdOutlineChair />
            ) : (
                <LuBed />
            )}
        </Text>
    );
}

const styles = {
    btn: {
        color: "pink.600",
        cursor: "pointer",
        transition: "all ease 0.3s",
    },
};
