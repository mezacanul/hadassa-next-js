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
    Spinner,
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
import { useAgendarLoading, useCitaID, useMetodoPago } from "@/components/agendar-cita/OrderSummary";
import FechaLogo from "@/components/FechaLogo";

// import Router from 'next/router';

Nexus({
    useDOM: Singleton({ title: "Hadassa Cerón" }),
    useSelectedDate: Singleton(null),
    useEvents: Singleton([]),
    useLoader: Singleton(true),
});

export default function App({ Component, pageProps }) {
    const [DOM] = loadHook("useDOM");
    const [loading, setLoading] = loadHook("useLoader");

    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <Provider>
            <Head>
                <title>{DOM.title}</title>
                <link rel="icon" href="/favicon.png" />
            </Head>

            <Box
                bg={"#f1f5ff"}
                h={loading ? "100vh" : "initial"}
                overflow={loading ? "hidden" : "default"}
            >
                <NavBar h={"11vh"} />
                <VStack id="Body" px={"2rem"} py={"2.5rem"} minH={"90vh"}>
                    <Component {...pageProps} />
                </VStack>
                <Loader loading={loading} />
            </Box>
        </Provider>
    );
}

function Loader({ loading }) {
    return (
        <Box
            display={loading ? "block" : "none"}
            position={"absolute"}
            w={"100vw"}
            h={"100vh"}
            bg={"white"}
            zIndex={10}
            top={0}
            left={0}
        >
            <HStack
                justifyContent={"center"}
                alignItems={"center"}
                w={"100%"}
                h={"100%"}
            >
                <Box transform={"scale(2)"}>
                    <Spinner size="xl" color="pink.500" borderWidth={"2px"} />
                </Box>
            </HStack>
        </Box>
    );
}

function NavBar({ h }) {
    const [selectedDate] = loadHook("useSelectedDate");
    const NextNav = useNextNav();
    const router = useRouter();
    const [events] = loadHook("useEvents");
    const [currentPath, setCurrentPath] = useState(null);
    const [loading, setLoading] = loadHook("useLoader");
    const [DOM, setDOM] = loadHook("useDOM")

    const [citaID, setCitaID] = useCitaID();
    const [mp, setMp] = useMetodoPago();
    const [agendarLoading, setAgendarLoading] = useAgendarLoading();

    useEffect(() => {
        console.log("route", router);
    }, [router]);
    
    useEffect(() => {
        switch (router.pathname) {
            case "/":
                setDOM({title: "Hadassa Cerón | Inicio"})
                break;
            case "/citas":
                setDOM({title: "Citas"})
                break;
            case "/citas/[citaID]":
                setDOM({title: "Cita"})
                break;
            case "/clientas":
                setDOM({title: "Clientas"})
                break;
            case "/clientas/[clientaID]":
                setDOM({title: "Clienta"})
                break;
            case "/lashistas":
                setDOM({title: "Lashistas"})
                break;
            case "/lashistas/[lashistaID]":
                setDOM({title: "Lashista"})
                break;
            case "/servicios":
                setDOM({title: "Servicios"})
                break;
            case "/servicios/[servicioID]":
                setDOM({title: "Servicio"})
                break;
            default: break;
        }
    }, [router.pathname]);

    return (
        <Grid
            boxShadow={"-3px 3px 10px rgba(0,0,0,0.05)"}
            px={"2rem"}
            templateColumns="3fr 2fr"
            gap={"2.5rem"}
            w={"100%"}
            // h={h}
            py={"1rem"}
            // pt={"1.5rem"}
            // pb={"1rem"}
            // mb={"2rem"}

            position={"sticky"}
            top={0}
            bg={"white"}
            zIndex={10}
            borderBottom={"2px solid #ec4899"}
        >
            <HStack gap={"0.5rem"} justify={"space-between"}>
                {router.pathname == "/" 
                    && <FechaLogo selectedDate={selectedDate}/>}
                {router.pathname != "/" && (
                    <Heading fontWeight={300} size={"4xl"} fontStyle={"italic"}>
                        {router.pathname == "/nueva-cita/[date]" && "Agendar Cita"}
                        {router.pathname == "/citas" && "Citas"}
                        {router.pathname == "/citas/[citaID]" && "Cita"}
                        {router.pathname == "/clientas" && "Clientas"}
                        {router.pathname == "/clientas/[clientaID]" && "Clienta"}
                        {router.pathname == "/servicios" && "Servicios"}
                        {router.pathname == "/servicios/[servicioID]" && "Servicio"}
                        {router.pathname == "/lashistas" && "Lashistas"}
                        {router.pathname == "/lashistas/[lashistaID]" && "Lashista"}
                        {router.pathname == "/dev" && "Developer"}
                    </Heading>
                )}
                {/* format(info.date, "yyyy-MM-dd"); */}
                {router.pathname == "/" ? (
                    <Button
                        bg={"pink.500"}
                        onClick={() => {
                            setLoading(true);
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
                            setMp([])
                            setCitaID(null)
                            setAgendarLoading(null)
                            setLoading(true);
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
                        setLoading(true);
                        NextNav.push("/citas");
                    }}
                    color={"#ec4899"}
                >
                    Citas
                </Link>
                <Link
                    onClick={() => {
                        setLoading(true);
                        NextNav.push("/clientas");
                    }}
                    color={"#ec4899"}
                >
                    Clientas
                </Link>
                <Link
                    onClick={() => {
                        setLoading(true);
                        NextNav.push("/servicios");
                    }}
                    color={"#ec4899"}
                >
                    Servicios
                </Link>
                <Link
                    onClick={() => {
                        setLoading(true);
                        NextNav.push("/lashistas");
                    }}
                    color={"#ec4899"}
                >
                    Lashistas
                </Link>
                {/* <Button bg={"#ec4899"} size={"xs"}>
                    <RxHamburgerMenu />
                </Button> */}
            </HStack>
        </Grid>
    );
}
