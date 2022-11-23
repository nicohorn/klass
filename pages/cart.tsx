import React from "react";
import { useState, useEffect } from "react";
import { useProducts } from "./layout/navbar";
import clientPromise from "../mongodb";

export default function Cart({ items }) {
  const productsCart = useProducts((state: any) => state.cart);
  const setCart = useProducts((state: any) => state.setCart);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

  useEffect(() => {
    let retrieveLocalStorage = JSON.parse(localStorage.getItem("my-cart"));

    //console.log("Retrieve Local Storage", retrieveLocalStorage);
    if (retrieveLocalStorage) {
      setCart(retrieveLocalStorage);
    }
  }, []);

  useEffect(() => {
    if (JSON.stringify(productsCart) != "[]") {
      localStorage.setItem("my-cart", JSON.stringify(productsCart));
    }
  });

  const filteredProducts = () => {
    //Function to "join" the products retrieved from the db and the products in cart (which only have id and count properties, while the products form the database have all the rest of the info)
    return productsCart.map((product) => {
      return { ...product, ...items.find((item) => item._id === product.id) };
    });
  };

  let transformedProducts = filteredProducts();

  return (
    <main className="w-[50%] mx-auto flex flex-col gap-3 my-10">
      {transformedProducts.map((product, i) => {
        return (
          <div key={i} className="border p-5 flex gap-5 justify-between">
            <div className="flex gap-4">
              <div className="font-bold">{product.name}</div>
              <div>Cantidad: {product.count}</div>
              <div>
                Precio individual:{" "}
                {typeof product.price == "number"
                  ? formatter.format(product.price)
                  : formatter.format(product.price[0])}
              </div>
            </div>
            <div>
              Total:{" "}
              {typeof product.price == "number"
                ? formatter.format(product.price * product.count)
                : formatter.format(product.price[0] * product.count)}
            </div>
          </div>
        );
      })}
    </main>
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
