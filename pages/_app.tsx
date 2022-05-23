import "tailwindcss/tailwind.css";
import { useRouter } from "next/router";
import Navbar from "./layout/navbar";

function MyApp({ Component, pageProps }) {
  const path = useRouter().pathname;

  console.log(path);
  return (
    <>
      <Navbar path={path} />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
