import {
    Box,
    Text,
    HStack,
    VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuBed } from "react-icons/lu";
import { MdOutlineChair } from "react-icons/md";

export default function CamasLive() {
    const [liveFeed, setLiveFeed] = useState({
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
    });

    const updateLiveFeed = (id, type) => {
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
    };

    const styles = {
        chair: {
            fontSize: "2rem",
            color: "pink.600",
            cursor: "pointer",
            transition: "all ease 0.3s",
            // _hover: {
            //     transform: "scale(1.1)",
            // },
        },
        bed: {
            fontSize: "3rem",
            color: "pink.600",
            cursor: "pointer",
            transition: "all ease 0.3s",
            // _hover: {
            //     transform: "scale(1.1)",
            // },
        },
    };
    return (
        <Box
            // mt="3rem"
            w="100%"
        >
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
            >
                <VStack>
                    {liveFeed.sillas.map((silla) => (
                        <Text
                            key={silla.id}
                            color={
                                silla.active
                                    ? "pink.500"
                                    : "black"
                            }
                            style={styles.chair}
                            _hover={{
                                transform: "scale(1.1)",
                            }}
                        >
                            <MdOutlineChair
                                key={silla.id}
                                // style={styles.chair}
                                color={
                                    silla.active
                                        ? "pink.500"
                                        : "gray.500"
                                }
                                onClick={() =>
                                    updateLiveFeed(
                                        silla.id,
                                        "sillas"
                                    )
                                }
                            />
                        </Text>
                    ))}
                </VStack>
                <HStack
                    justify="space-between"
                    px="1rem"
                    w="100%"
                >
                    {liveFeed.camas.map((cama) => (
                        <Text
                            key={cama.id}
                            color={
                                cama.active
                                    ? "pink.500"
                                    : "black"
                            }
                            style={styles.bed}
                            _hover={{
                                transform: "scale(1.1)",
                            }}
                        >
                            <LuBed
                                // style={styles.bed}
                                onClick={() =>
                                    updateLiveFeed(
                                        cama.id,
                                        "camas"
                                    )
                                }
                            />
                        </Text>
                    ))}
                </HStack>
            </HStack>
        </Box>
    );
}
