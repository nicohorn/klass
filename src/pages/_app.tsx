import "tailwindcss/tailwind.css";
import { useRouter } from "next/router";
import Navbar from "./layout/navbar";
import Footer from "./layout/footer";
import Head from "next/head";
import React, { useEffect } from "react";
import { UserProvider } from "@auth0/nextjs-auth0";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../app/global.css";

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

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Albert+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,900;1,300&family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,900;1,400&display=swap"
        />
      </Head>

      <main className=" bg-primary">
        <Navbar path={path} />
        <ToastContainer position="top-center" />

        <Component {...pageProps} />
        <Footer />
      </main>
    </UserProvider>
  );
}

export default MyApp;
