// import "@/styles/globals.css";
import { Provider } from "@/components/ui/provider";
import Head from "next/head";
import { loadHook, Nexus, Singleton } from "@/utils/lattice-design";
import {
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
import { useEffect } from "react";
import { useRouter } from "next/router";
// import Router from 'next/router';

Nexus({
    useDOM: Singleton({ title: "Hadassa Cerón" }),
    useSelectedDate: Singleton(null),
});

export default function App({ Component, pageProps }) {
    const [DOM] = loadHook("useDOM");

    return (
        <Provider>
            <Head>
                <title>{DOM.title}</title>
                <link rel="icon" href="/favicon4.png" />
            </Head>

            <VStack id="Body" px={"2rem"}>
                <NavBar />
                <Component {...pageProps} />
            </VStack>
        </Provider>
    );
}

function NavBar() {
    const [selectedDate] = loadHook("useSelectedDate");
    const NextNav = useNextNav();
    const router = useRouter();

    useEffect(() => {
        console.log("route", router);

        // const handleRouteChange = (url) => {
        //     console.log(router.pathname);
        // };

        // router.events.on("routeChangeComplete", handleRouteChange);
        // return () =>
        //     router.events.off("routeChangeComplete", handleRouteChange);
    }, [router]);

    return (
        <Grid templateColumns="3fr 2fr" gap={"2.5rem"} w={"100%"} py={"2rem"}>
            <Heading fontWeight={300} size={"4xl"}>
                {formatHoyTitle(selectedDate)}
            </Heading>
            {/* format(info.date, "yyyy-MM-dd"); */}

            <HStack gap={"0.5rem"} justify={"end"}>
                {router.pathname != "/nueva-cita/[date]" && (
                    <Button
                        bg={"#ec4899"}
                        onClick={() => {
                            const parsedDate = parse(
                                selectedDate,
                                "yyyy-MM-dd",
                                new Date()
                            );
                            const formattedDate = format(
                                parsedDate,
                                "dd-MM-yyyy"
                            );
                            console.log(formattedDate); // "26-04-2025"
                            NextNav.push(`/nueva-cita/${formattedDate}`);
                        }}
                    >
                        <HStack>
                            <Text fontSize={"1rem"} fontWeight={700}>
                                {`Agendar`}
                            </Text>
                            <LuCalendarPlus />
                        </HStack>
                    </Button>
                )}
                <Button bg={"#ec4899"}>
                    <RxHamburgerMenu />
                </Button>
            </HStack>
        </Grid>
    );
}
