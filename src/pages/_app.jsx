// import "@/styles/globals.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "@/components/ui/provider";
import Head from "next/head";
import {
    loadHook,
    Nexus,
    Singleton,
} from "@/utils/lattice-design";
import {
    Box,
    HStack,
    Spinner,
    VStack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import "@/styles/Tables.css";
import "@/styles/main.css";
import API from "@/services/main";
import NavBar from "@/components/Layout/Navbar";

// import 'ag-grid-community/styles/ag-grid.css'
// import 'ag-grid-community/styles/ag-theme-alpine.css'

// import Router from 'next/router';

Nexus({
    useDOM: Singleton({ title: "Hadassa Cerón" }),
    useSelectedDate: Singleton(null),
    useEvents: Singleton([]),
    useLoader: Singleton(true),
    useClientas: Singleton(null),
    useHorarios: Singleton(null),
});

export default function App({ Component, pageProps }) {
    const [DOM] = loadHook("useDOM");
    const [loading, setLoading] = loadHook("useLoader");
    const [clientas, setClientas] = loadHook("useClientas");
    const [horarios, setHorarios] = loadHook("useHorarios");

    useEffect(() => {
        API.horarios.getAll().then((horariosResp) => {
            console.log("horariosResp", horariosResp);
            setHorarios(horariosResp.data);
        });
        setLoading(false);
        API.clientas.getClientas().then((clientasResp) => {
            console.log("clientasResp", clientasResp);
            setClientas(clientasResp.data);
        });
    }, []);

    return (
        <Provider>
            <Head>
                <title>{DOM.title}</title>
                <link
                    rel="icon"
                    href="/favicon.png"
                />
            </Head>

            <Box
                bg={"#f1f5ff"}
                h={loading ? "100vh" : "initial"}
                overflow={loading ? "hidden" : "default"}
            >
                <NavBar h={"11vh"} />
                <VStack
                    id="Body"
                    px={"2rem"}
                    py={"2.5rem"}
                    minH={"90vh"}
                >
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
                    <Spinner
                        size="xl"
                        color="pink.500"
                        borderWidth={"2px"}
                    />
                </Box>
            </HStack>
        </Box>
    );
}
