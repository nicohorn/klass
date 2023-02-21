import React from "react";
import { useEffect, useState, useLayoutEffect } from "react";
import { useProducts } from "../zustand";
import clientPromise from "@clientPromise";
import { useUser } from "@auth0/nextjs-auth0";

export default function Home({ products }) {
  const setCart = useProducts((state: any) => state.setCart);
  let productsCart = useProducts((state: any) => state.cart);

  const { user, error, isLoading } = useUser();

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

  useEffect(() => {
    let retrieveLocalStorage = JSON.parse(localStorage.getItem("my-cart"));

    if (retrieveLocalStorage) {
      setCart(retrieveLocalStorage);
    }
  }, []);

  useEffect(() => {
    if (JSON.stringify(productsCart) != "[]") {
      localStorage.setItem("my-cart", JSON.stringify(productsCart));
    }
  });

  const camaFuncional2Plazas = products.find((product) => {
    return product.name === "Cama Funcional - 2 plazas";
  });

  console.log(camaFuncional2Plazas.img[0]);

  return (
    <main className="w-full relative text-white ">
      <div
        id="product-container"
        className=" bg-center bg-cover opacity-animation  md:mx-20 p-8 px-4 md:px-16 rounded-sm  shadow-lg"
        style={{
          backgroundImage: `url("${camaFuncional2Plazas.img[0]}")`,
        }}
      >
        <p className="uppercase slide-bottom  text-3xl text-center font-bold text-neutral-50 mb-5 drop-shadow-[2px_2px_2px_rgba(0,0,0,0.30)] xl:text-5xl lg:text-4xl  lg:text-left">
          Cama funcional de dos plazas
        </p>
        <div className="flex gap-4 flex-col xl:flex-row">
          <div
            id="container-left"
            className="flex-1 justify-items-stretch self-stretch flex flex-col text-lg  opacity-animation  text-justify  text-white font-semibold"
          >
            <div className="backdrop-blur-lg shadow-lg text-[.9rem] md:text-lg rounded-sm bg-black/50  py-5 px-4 md:px-8">
              {camaFuncional2Plazas.description}
            </div>
            <div className="cursor-pointer hover:bg-green-600 px-3 py-2 mx-8 my-5 drop-shadow-[2px_2px_2px_rgba(0,0,0,0.30)] bg-green-700 md:self-start self-center font-normal text-sm transition-all duration-200">
              Presupuesto personalizado
            </div>

            <div className="mt-auto flex flex-col flex-wrap justify-center md:justify-end gap-5 items-center md:items-end">
              <div className="px-4 py-2 rounded-sm bg-green-600 ">
                <p className="text-4xl text-white">
                  {formatter.format(camaFuncional2Plazas.base_price)}
                </p>
                <p className="text-right">Precio base</p>
              </div>
              <div className="flex gap-5">
                {" "}
                <div className=" p-3 md:text-lg text-sm border bg-green-900/60 shadow-md transition-all duration-200 hover:border-green-700 hover:bg-green-700 cursor-pointer font-normal ">
                  Ver todos los productos
                </div>
                <div className=" p-3 border md:text-lg text-sm cursor-pointer border-green-700 transition-all duration-200 hover:bg-green-600 shadow-md bg-green-700">
                  Ver detalles
                </div>
              </div>
            </div>
          </div>

          <div
            className="bg-cover backdrop-blur-lg slide-left  bg-center xl:w-[40%] h-[60vh] drop-shadow-[0px_5px_5px_rgba(0,0,0,0.250)]"
            style={{ backgroundImage: `url("${camaFuncional2Plazas.img[0]}")` }}
          ></div>
        </div>
      </div>
    </main>
  );
}

export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  async function profileHandler() {
    const client = await clientPromise;
    const db = client.db("klass_ecommerce");
    const collection = db.collection("profiles");
    const prods = await collection.find({}).toArray();

    return await collection.find({}).toArray();
  }

  async function productsHandler() {
    const client = await clientPromise;
    const db = client.db("klass_ecommerce");
    const collection = db.collection("products");

    return await collection.find({}).toArray();
  }

  const profileResponse = await profileHandler();

  const productsResponse = await productsHandler();

  // By returning { props: { items } }, the Products component
  // will receive `items` as a prop at build time
  return {
    props: {
      products: productsResponse.map((product) => {
        return {
          ...product,
          _id: product._id.toString(),
        };
      }),
      profiles: profileResponse.map((profile) => {
        return {
          ...profile,
          _id: profile._id.toString(),
        };
      }),
    },
  };
}
