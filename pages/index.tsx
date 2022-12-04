import React from "react";
import { useEffect, useState, useLayoutEffect } from "react";
import { useProducts } from "../zustand";
import clientPromise from "../mongodb";
import Router from "next/router";

function Home(obj: { items }) {
  const setCart = useProducts((state: any) => state.setCart);
  let productsCart = useProducts((state: any) => state.cart);

  useEffect(() => {
    let retrieveLocalStorage = JSON.parse(localStorage.getItem("my-cart"));

    if (retrieveLocalStorage) {
      setCart(retrieveLocalStorage);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("route")) {
      Router.push(`${localStorage.getItem("route")}`);
      localStorage.removeItem("route");
    }
    if (JSON.stringify(productsCart) != "[]") {
      localStorage.setItem("my-cart", JSON.stringify(productsCart));
    }
  });

  return (
    <div className="w-full flex-grow">
      <div className="flex h-full lg:flex-row flex-col">
        {obj.items.slice(1, 6).map((item, i) => (
          <div
            key={i}
            style={{ backgroundImage: `url(${item.img})` }}
            className="flex-[0.5] bg-cover bg-center bg-no-repeat hover:flex-[0.6] transition-all duration-300 group grid hover:p-20 drop-shadow-[8px_8px_20px_rgba(0,0,0,0.95)]"
          >
            <a href={`/products/` + item._id}>
              <div className="group-hover:opacity-100 opacity-0 text-4xl font-bold transition-all duration-500 ">
                <p className="bg-black text-white bg-opacity-40 drop-shadow p-5">
                  {item.name}
                </p>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps(context) {
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

export default Home;
