// import "@/styles/globals.css";
import { Provider } from "@/components/ui/provider";
import Head from "next/head";
import { loadHook, Nexus, Singleton } from "@/utils/lattice-design";
import {
    Box,
    Button,
    Grid,
    Heading,
    HStack,
    Link,
    Text,
    useSelect,
    VStack,
} from "@chakra-ui/react";
import { formatHoyTitle } from "@/utils/main";
import { BiReceipt } from "react-icons/bi";
import { RxHamburgerMenu } from "react-icons/rx";
import { parse, format } from "date-fns";
import { LuCalendarPlus } from "react-icons/lu";
import { useRouter as useNextNav } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaHouseChimney } from "react-icons/fa6";

// import Router from 'next/router';

Nexus({
    useDOM: Singleton({ title: "Hadassa Cerón" }),
    useSelectedDate: Singleton(null),
    useEvents: Singleton([]),
});

export default function App({ Component, pageProps }) {
    const [DOM] = loadHook("useDOM");

    return (
        <Provider>
            <Head>
                <title>{DOM.title}</title>
                <link rel="icon" href="/favicon4.png" />
            </Head>

            <Box bg={"#f1f5ff"}>
                <NavBar h={"10vh"} />
                <VStack id="Body" px={"2rem"} py={"2.5rem"} minH={"90vh"}>
                    <Component {...pageProps} />
                </VStack>
            </Box>
        </Provider>
    );
}

function NavBar({ h }) {
    const [selectedDate] = loadHook("useSelectedDate");
    const NextNav = useNextNav();
    const router = useRouter();
    const [events] = loadHook("useEvents");
    const [currentPath, setCurrentPath] = useState(null);

    useEffect(() => {
        console.log("route", router);
    }, [router]);

    return (
        <Grid
            boxShadow={"-3px 3px 10px rgba(0,0,0,0.05)"}
            px={"2rem"}
            templateColumns="3fr 2fr"
            gap={"2.5rem"}
            w={"100%"}
            h={h}
            // pt={"1.5rem"}
            // pb={"1rem"}
            // mb={"2rem"}

            position={"sticky"}
            top={0}
            bg={"white"}
            zIndex={10}
            borderBottom={"1px solid #ec4899"}
        >
            <HStack gap={"0.5rem"} justify={"space-between"}>
                <Heading fontWeight={300} size={"4xl"} fontStyle={"italic"}>
                    {router.pathname == "/" && formatHoyTitle(selectedDate)}
                    {router.pathname == "/citas" && "Citas"}
                    {router.pathname == "/clientas" && "Clientas"}
                    {router.pathname == "/servicios" && "Servicios"}
                    {router.pathname == "/lashistas" && "Lashistas"}
                </Heading>
                {/* format(info.date, "yyyy-MM-dd"); */}
                {router.pathname == "/" ? (
                    <Button
                        bg={"pink.500"}
                        onClick={() => {
                            console.log("events", events);

                            const parsedDate = parse(
                                selectedDate,
                                "yyyy-MM-dd",
                                new Date()
                            );
                            const formattedDate = format(
                                parsedDate,
                                "dd-MM-yyyy"
                            );
                            console.log(
                                selectedDate,
                                parsedDate,
                                formattedDate
                            );
                            // console.log(formattedDate); // "26-04-2025"
                            NextNav.push(`/nueva-cita/${formattedDate}`);
                        }}
                    >
                        <HStack>
                            <Text fontSize={"1rem"}>{`Agendar`}</Text>
                            <LuCalendarPlus />
                        </HStack>
                    </Button>
                ) : (
                    <Button
                        onClick={() => {
                            NextNav.push("/");
                        }}
                        bg={"pink.500"}
                    >
                        <HStack>
                            <Text fontSize={"1rem"}>{`Inicio`}</Text>
                            <FaHouseChimney />
                        </HStack>
                    </Button>
                )}
            </HStack>

            <HStack
                fontSize={"1.2rem"}
                w={"100%"}
                justify={"space-between"}
                align={"center"}
            >
                <Link
                    onClick={() => {
                        NextNav.push("/citas");
                    }}
                    color={"#ec4899"}
                >
                    Citas
                </Link>
                <Link
                    onClick={() => {
                        NextNav.push("/clientas");
                    }}
                    color={"#ec4899"}
                >
                    Clientas
                </Link>
                <Link onClick={() => {
                        NextNav.push("/servicios");
                    }} color={"#ec4899"}>Servicios</Link>
                <Link onClick={() => {
                        NextNav.push("/lashistas");
                    }} color={"#ec4899"}>Lashistas</Link>
                {/* <Button bg={"#ec4899"} size={"xs"}>
                    <RxHamburgerMenu />
                </Button> */}
            </HStack>
        </Grid>
    );
}
