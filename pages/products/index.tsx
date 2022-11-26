import React from "react";
import { useEffect, useState, useLayoutEffect } from "react";
import { useProducts } from "../layout/navbar";
import clientPromise from "../../mongodb";

function Products(obj: { items }) {
  const addToCart = useProducts((state: any) => state.addToCart);
  const setCart = useProducts((state: any) => state.setCart);
  let productsCart = useProducts((state: any) => state.cart);

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

  return (
    <div className="w-full flex-grow">
      <div className="w-[70%] mx-auto my-10 ">
        <div className="mb-10 flex justify-between lg:flex-row flex-col gap-4 items-center">
          {" "}
          <div className="font-bold text-4xl text-center lg:text-left">
            Nuestros productos
          </div>
          <div>
            <input
              className="border border-black px-3 py-1 outline-none "
              placeholder="Buscar"
              type="text"
            />
          </div>
        </div>
        <div className="grid lg:grid-cols-2 auto-rows-auto 2xl:grid-cols-4 gap-6">
          {obj.items.map((item, i) => (
            <div
              key={i}
              className=" border-2 border-black border-opacity-0 hover:border-opacity-100  transition-all duration-200 active:scale-95 hover:drop-shadow-[8px_8px_5px_rgba(0,0,0,0.55)] group"
            >
              <a href={`/products/` + item._id}>
                <div className="flex flex-col ">
                  <img
                    className="aspect-square object-cover object-center "
                    src={item.img}
                  ></img>

                  <div className="bg-black text-white drop-shadow p-5">
                    <p className="font-bold text-lg">{item.name}</p>
                    <p className="text-xs">Categorías: {item.categories}</p>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library

  async function handler() {
    const client = await clientPromise;
    const db = client.db("klass_ecommerce");
    const collection = db.collection("products");

    return await collection.find({}).toArray();
  }

  const res = await handler();

  // By returning { props: { items } }, the Products component
  // will receive `items` as a prop at build time
  return {
    props: {
      items: res.map((item) => {
        return {
          ...item,
          _id: item._id.toString(),
        };
      }),
    },
  };
}

export default Products;
