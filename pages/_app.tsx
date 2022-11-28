import "tailwindcss/tailwind.css";
import { useRouter } from "next/router";
import Navbar from "./layout/navbar";
import Head from "next/head";
import { useEffect } from "react";
import React from "react";
import Router from "next/router";

function FacebookPixel() {
  React.useEffect(() => {
    import("react-facebook-pixel")
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init("1777161935989789");
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
    <>
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
      </main>
    </>
  );
}

export default MyApp;
