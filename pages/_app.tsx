import "tailwindcss/tailwind.css";
import { useRouter } from "next/router";
import Navbar from "./layout/navbar";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  const path = useRouter().pathname;

  return (
    <>
      <Head>
        <title>Klass</title>
        <meta
          name="facebook-domain-verification"
          content="l8kt4tprsunykmw8wkpz6xuy1bkfin"
        />
      </Head>
      <main className="flex flex-col h-screen">
        <Navbar path={path} />
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default MyApp;
