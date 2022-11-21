import "tailwindcss/tailwind.css";
import { useRouter } from "next/router";
import Navbar from "./layout/navbar";

function MyApp({ Component, pageProps }) {
  const path = useRouter().pathname;

  return (
    <main className="flex flex-col h-screen">
      <Navbar path={path} />
      <Component {...pageProps} />
    </main>
  );
}

export default MyApp;
