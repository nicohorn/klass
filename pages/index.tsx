import React from "react";
import { useEffect, useState, useLayoutEffect } from "react";
import { useProducts } from "../zustand";
import clientPromise from "@clientPromise";
import { useUser } from "@auth0/nextjs-auth0";

export default function Home({ products }) {
  const setCart = useProducts((state: any) => state.setCart);
  let productsCart = useProducts((state: any) => state.cart);

  const { user, error, isLoading } = useUser();

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
        className=" bg-center bg-cover opacity-animation  mx-20 p-8 px-16 rounded-sm  shadow-lg"
        style={{
          backgroundImage: `url("${camaFuncional2Plazas.img[0]}")`,
        }}
      >
        <p className="uppercase slide-bottom  text-6xl font-bold text-neutral-50 mb-5 drop-shadow-[2px_2px_2px_rgba(0,0,0,0.30)]">
          Cama funcional de dos plazas
        </p>
        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="flex-1  self-stretch flex flex-col text-lg  opacity-animation  text-justify  text-white font-semibold">
            <div className="backdrop-blur-lg shadow-lg  rounded-sm bg-black/50  py-5 px-8">
              {camaFuncional2Plazas.description}
            </div>
            <div className="self-end  flex-grow">
              <span className="p-4 bg-green-500 rounded-sm my-auto">
                Presupuesto personalizado
              </span>
            </div>
          </div>

          <div
            className="bg-cover backdrop-blur-lg slide-left   bg-center lg:w-[40%] h-[60vh] drop-shadow-[0px_5px_5px_rgba(0,0,0,0.250)]"
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
