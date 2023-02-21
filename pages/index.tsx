import React from "react";
import { useEffect, useState, useLayoutEffect } from "react";
import { useProducts } from "../zustand";
import clientPromise from "@clientPromise";
import { useUser } from "@auth0/nextjs-auth0";
import ProductContainer from "./components/productContainer";

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

  const cajoneraAster = products.find((product) => {
    return product.name === "Cajonera Aster";
  });

  const rackBrezo = products.find((product) => {
    return product.name === "Rack Brezo";
  });

  const escritorioKlassic = products.find((product) => {
    return product.name === "Escritorio Klassic";
  });

  const estanteriaKlassic = products.find((product) => {
    return product.name === "Estantería Klassic";
  });

  return (
    <main className="w-full relative text-white ">
      <div
        id="product-container"
        className=" bg-center bg-cover opacity-animation  md:mx-20 p-8 px-4 md:px-16 rounded-sm  shadow-lg"
        style={{
          backgroundImage: `url("${camaFuncional2Plazas.img[0]}")`,
        }}
      >
        <div className="flex gap-4 flex-col xl:flex-row">
          <div
            id="container-left"
            className="flex-1 justify-items-stretch self-stretch flex flex-col text-lg  opacity-animation  text-justify  text-white font-semibold"
          >
            <p className="uppercase slide-bottom  text-3xl text-center font-bold text-neutral-50 mb-5 drop-shadow-[2px_2px_2px_rgba(0,0,0,0.30)] xl:text-5xl lg:text-4xl  lg:text-left">
              Cama funcional de dos plazas
            </p>
            <div className="backdrop-blur-lg shadow-lg font-normal text-[.9rem] md:text-lg rounded-sm bg-black/50  py-5 px-4 md:px-8">
              {camaFuncional2Plazas.description}
            </div>
            <div className="cursor-pointer hover:bg-green-600 px-3 py-2 mx-8 my-5 drop-shadow-[2px_2px_2px_rgba(0,0,0,0.30)] bg-green-700 md:self-start self-center font-normal text-sm transition-all duration-200">
              Presupuesto personalizado
            </div>

            <div className="mt-auto flex flex-col flex-wrap justify-center text-white md:justify-end gap-5 items-center md:items-end">
              <div className="px-4 py-4 rounded-sm text-green-600  flex items-end gap-2 bg-white drop-shadow-[1px_1px_3px_rgba(0,0,0,0.5)]">
                <p className="md:text-4xl text-3xl font-bold  ">
                  {formatter.format(camaFuncional2Plazas.base_price)}
                </p>
                <p className="text-right font-normal">Precio base</p>
              </div>
              <div className="flex gap-5">
                {" "}
                <div className=" p-3 md:text-lg text-sm border  drop-shadow-[1px_1px_1px_rgba(0,0,0,0.60)] transition-all duration-200 hover:border-green-700 hover:bg-green-700  cursor-pointer  ">
                  <a href="/products">Ver todos los productos</a>
                </div>
                <div className=" p-3 border md:text-lg text-sm cursor-pointer border-green-700 transition-all duration-200 hover:bg-green-500 hover:border-green-500 drop-shadow-[1px_1px_3px_rgba(0,0,0,0.60)]  bg-green-700">
                  <a href={`/products/${camaFuncional2Plazas._id}`}>
                    Ver detalles
                  </a>
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
      <ProductContainer odd={false}>
        <div className="px-8 flex flex-col gap-4">
          <h1 className="font-bold text-3xl text-left">{cajoneraAster.name}</h1>{" "}
          <div className="flex flex-col sm:flex-row gap-4">
            <img
              className="sm:w-1/2 object-cover object-center aspect-[4/5]"
              src={`${cajoneraAster.img[0]}`}
            ></img>
            <div className="flex flex-col">
              <p>{cajoneraAster.description}</p>{" "}
              <div className="cursor-pointer self-start hover:bg-green-600 px-3 py-2 my-5 drop-shadow-[2px_2px_2px_rgba(0,0,0,0.30)] bg-green-700  font-normal text-sm transition-all duration-200">
                Presupuesto personalizado
              </div>
              <div className="px-4 py-4 rounded-sm text-green-600  flex items-end justify-center sm:self-start gap-2 bg-white drop-shadow-[1px_1px_3px_rgba(0,0,0,0.5)] mb-5">
                <p className="md:text-2xl text-xl font-bold">
                  {formatter.format(cajoneraAster.base_price)}
                </p>
                <p className="text-right font-normal text-xs">Precio base</p>
              </div>
              <div className=" p-3 sm:self-end text-center mt-auto rounded-sm border cursor-pointer border-green-700 transition-all duration-200 hover:bg-green-500 hover:border-green-500 drop-shadow-[1px_1px_3px_rgba(0,0,0,0.60)] bg-green-700">
                <a href={`/products/${cajoneraAster._id}`}>Ver detalles</a>
              </div>
            </div>
          </div>
        </div>
      </ProductContainer>
      <ProductContainer odd={true}>
        <div className="px-8 flex flex-col gap-4">
          <h1 className="font-bold text-3xl text-left">{rackBrezo.name}</h1>{" "}
          <div className="flex flex-col sm:flex-row gap-4">
            <img
              className="sm:w-1/2 object-cover object-center aspect-[4/5]"
              src={`${rackBrezo.img[0]}`}
            ></img>
            <div className="flex flex-col">
              <p>{rackBrezo.description}</p>{" "}
              <div className="cursor-pointer self-start hover:bg-green-600 px-3 py-2 my-5 drop-shadow-[2px_2px_2px_rgba(0,0,0,0.30)] bg-green-700  font-normal text-sm transition-all duration-200">
                Presupuesto personalizado
              </div>
              <div className="px-4 py-4 rounded-sm text-green-600  flex items-end justify-center sm:self-start gap-2 bg-white drop-shadow-[1px_1px_3px_rgba(0,0,0,0.5)] mb-5">
                <p className="md:text-2xl text-xl font-bold">
                  {formatter.format(rackBrezo.base_price)}
                </p>
                <p className="text-right font-normal text-xs">Precio base</p>
              </div>
              <div className=" p-3 sm:self-end text-center mt-auto rounded-sm border cursor-pointer border-green-700 transition-all duration-200 hover:bg-green-500 hover:border-green-500 drop-shadow-[1px_1px_3px_rgba(0,0,0,0.60)] bg-green-700">
                <a href={`/products/${rackBrezo._id}`}>Ver detalles</a>
              </div>
            </div>
          </div>
        </div>
      </ProductContainer>
      <ProductContainer odd={false}>
        {" "}
        <div className="px-8 flex flex-col gap-4">
          <h1 className="font-bold text-3xl text-left">
            {escritorioKlassic.name}
          </h1>{" "}
          <div className="flex flex-col sm:flex-row gap-4">
            <img
              className="sm:w-1/2 object-cover object-center aspect-[4/5]"
              src={`${escritorioKlassic.img[0]}`}
            ></img>
            <div className="flex flex-col">
              <p>{escritorioKlassic.description}</p>{" "}
              <div className="cursor-pointer self-start hover:bg-green-600 px-3 py-2 my-5 drop-shadow-[2px_2px_2px_rgba(0,0,0,0.30)] bg-green-700  font-normal text-sm transition-all duration-200">
                Presupuesto personalizado
              </div>
              <div className="px-4 py-4 rounded-sm text-green-600  flex items-end justify-center sm:self-start gap-2 bg-white drop-shadow-[1px_1px_3px_rgba(0,0,0,0.5)] mb-5">
                <p className="md:text-2xl text-xl font-bold">
                  {formatter.format(escritorioKlassic.base_price)}
                </p>
                <p className="text-right font-normal text-xs">Precio base</p>
              </div>
              <div className=" p-3 sm:self-end text-center mt-auto rounded-sm border cursor-pointer border-green-700 transition-all duration-200 hover:bg-green-500 hover:border-green-500 drop-shadow-[1px_1px_3px_rgba(0,0,0,0.60)] bg-green-700">
                <a href={`/products/${escritorioKlassic._id}`}>Ver detalles</a>
              </div>
            </div>
          </div>
        </div>
      </ProductContainer>
      <ProductContainer odd={true}>
        {" "}
        <div className="px-8 flex flex-col gap-4">
          <h1 className="font-bold text-3xl text-left">
            {estanteriaKlassic.name}
          </h1>{" "}
          <div className="flex flex-col sm:flex-row gap-4">
            <img
              className="sm:w-1/2 object-cover object-center aspect-[4/5]"
              src={`${estanteriaKlassic.img[0]}`}
            ></img>
            <div className="flex flex-col">
              <p>{estanteriaKlassic.description}</p>{" "}
              <div className="cursor-pointer self-start hover:bg-green-600 px-3 py-2 my-5 drop-shadow-[2px_2px_2px_rgba(0,0,0,0.30)] bg-green-700  font-normal text-sm transition-all duration-200">
                Presupuesto personalizado
              </div>
              <div className="px-4 py-4 rounded-sm text-green-600  flex items-end justify-center sm:self-start gap-2 bg-white drop-shadow-[1px_1px_3px_rgba(0,0,0,0.5)] mb-5">
                <p className="md:text-2xl text-xl font-bold">
                  {formatter.format(estanteriaKlassic.base_price)}
                </p>
                <p className="text-right font-normal text-xs">Precio base</p>
              </div>
              <div className=" p-3 sm:self-end text-center mt-auto rounded-sm border cursor-pointer border-green-700 transition-all duration-200 hover:bg-green-500 hover:border-green-500 drop-shadow-[1px_1px_3px_rgba(0,0,0,0.60)] bg-green-700">
                <a href={`/products/${estanteriaKlassic._id}`}>Ver detalles</a>
              </div>
            </div>
          </div>
        </div>
      </ProductContainer>
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
