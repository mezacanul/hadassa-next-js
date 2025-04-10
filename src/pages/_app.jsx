// import "@/styles/globals.css";
import { Provider } from "@/components/ui/provider";
import Head from "next/head";
import { loadHook, MiniSingleton, Nexus } from "@/utils/lattice-design";

Nexus({
    useDOM: MiniSingleton({title: "Hadassa Cerón"}),
    // useClientas: MiniSingleton([]), 
});

export default function App({ Component, pageProps }) {
    const [DOM] = loadHook("useDOM")
    
    return (
        <Provider>
            <Head>
                <title>{DOM.title}</title>
                <link rel="icon" href="/favicon4.png" />
            </Head>
            <Component {...pageProps} />
        </Provider>
    );
}
