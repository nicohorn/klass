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

{
  /* <script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '618108533455824');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=618108533455824&ev=PageView&noscript=1"
/></noscript> */
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
