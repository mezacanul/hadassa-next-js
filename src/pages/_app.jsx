// import "@/styles/globals.css";
import { Provider } from "@/components/ui/provider";
import Head from "next/head";
// import { MiniSingleton } from "@/utils/MiniSingleton";
// import { loadHook, PortableContext } from "@/utils/PortableContext";
import { loadHook, PortableContext, MiniSingleton } from "@/utils/fractal-design";

PortableContext({
    useDOM: MiniSingleton({title: "Hadassa Cerón"}),
    useClientas: MiniSingleton([]), 
    useServicios: MiniSingleton([]),
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
