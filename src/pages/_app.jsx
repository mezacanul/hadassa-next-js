// import "@/styles/globals.css";
import { Provider } from "@/components/ui/provider";
import Head from "next/head";

export default function App({ Component, pageProps }) {
    return (
        <Provider>
            <Head>
                <title>Hadassa Cerón</title>
                <link rel="icon" href="/favicon4.png" />
            </Head>
            <Component {...pageProps} />
        </Provider>
    );
}
