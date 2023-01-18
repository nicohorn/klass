import "tailwindcss/tailwind.css";
import { useRouter } from "next/router";
import Navbar from "./layout/navbar";
import Footer from "./layout/footer";
import Head from "next/head";
import React, { useEffect } from "react";
import Router from "next/router";
import { UserProvider } from "@auth0/nextjs-auth0";
import Script from "next/script";

function FacebookPixel() {
  React.useEffect(() => {
    import("react-facebook-pixel")
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init("908343633688942");
        ReactPixel.pageView();

        Router.events.on("routeChangeComplete", () => {
          ReactPixel.pageView();
        });
      });
  });
  return null;
}

function MyApp({ Component, pageProps }) {
  const path = useRouter().pathname;

  return (
    <UserProvider>
      <Head>
        <title>Klass</title>

        <meta
          name="facebook-domain-verification"
          content="l8kt4tprsunykmw8wkpz6xuy1bkfin"
        />
      </Head>

      <FacebookPixel />
      <main className="flex flex-col h-screen">
        <Navbar path={path} />
        <Component {...pageProps} />
        <Footer />
      </main>
    </UserProvider>
  );
}

export default MyApp;
