import {
    Box,
    Text,
    HStack,
    VStack,
    Button,
    Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuBed } from "react-icons/lu";
import { MdOutlineChair } from "react-icons/md";
import { IoReload } from "react-icons/io5";

const initialLiveFeed = {
    sillas: [
        { id: "s1", active: false },
        { id: "s2", active: false },
        { id: "s3", active: false },
    ],
    camas: [
        { id: "c1", active: false },
        { id: "c2", active: false },
        { id: "c3", active: false },
    ],
};

export default function CamasLive() {
    const [isLoading, setIsLoading] = useState(false);
    const [liveFeed, setLiveFeed] =
        useState(initialLiveFeed);

    const updateLiveFeed = (id, type) => {
        setIsLoading(true);
        setTimeout(() => {
            setLiveFeed(() => {
                return {
                    ...liveFeed,
                    [type]: liveFeed[type].map((item) => {
                        if (item.id === id) {
                            return {
                                ...item,
                                active: !item.active,
                            };
                        }
                        return item;
                    }),
                };
            });
            setIsLoading(false);
        }, 500);
    };

    function onReload() {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
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
            bg="rgba(255, 255, 255, 0.7)"
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
            color={data.active ? "pink.500" : "green.500"}
            style={{
                ...styles.btn,
                fontSize:
                    type == "sillas" ? "2rem" : "3rem",
            }}
            _hover={{
                transform: "scale(1.1)",
            }}
            onClick={() => updateLiveFeed(data.id, type)}
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
