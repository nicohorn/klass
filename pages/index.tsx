import React from "react";
import { useEffect, useState, useLayoutEffect } from "react";
import { useProducts } from "./layout/navbar";
import clientPromise from "../mongodb";
import { setInterval } from "timers";

const createNewProduct = async (params: {
  img: string;
  productName: string;
  id: number;
}) => {
  const res = await fetch("/api/products", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  const data = await res.json();
};

function Home(obj: { items }) {
  const addToCart = useProducts((state: any) => state.addToCart);
  const setCart = useProducts((state: any) => state.setCart);
  let productsCart = useProducts((state: any) => state.cart);

  useEffect(() => {
    let retrieveLocalStorage = JSON.parse(localStorage.getItem("my-cart"));

    if (retrieveLocalStorage) {
      setCart(retrieveLocalStorage);
    }
  }, []);

  const [numberSlicer, setSlicer] = useState(0);

  useEffect(() => {
    if (JSON.stringify(productsCart) != "[]") {
      localStorage.setItem("my-cart", JSON.stringify(productsCart));
    }
  });

  setInterval(() => {
    if (numberSlicer <= obj.items.length - 5) {
      setSlicer(numberSlicer + 5);
    } else {
      setSlicer(0);
    }
  }, 15000);

  return (
    <div className="w-full flex-grow">
      <div className="flex h-full lg:flex-row flex-col">
        {obj.items.slice(numberSlicer, numberSlicer + 5).map((item, i) => (
          <div
            key={i}
            style={{ backgroundImage: `url(${item.img})` }}
            className="flex-[0.5] bg-cover bg-center bg-no-repeat hover:flex-[0.6] transition-all duration-300 group grid hover:p-20 shadow-2xl"
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
