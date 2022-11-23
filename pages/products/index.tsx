import React from "react";
import { useEffect, useState, useLayoutEffect } from "react";
import { useProducts } from "../layout/navbar";
import clientPromise from "../../mongodb";

const createNewProduct = async (params: {
  img: string;
  productName: string;
  id: number;
}) => {
  console.log("hola");
  const res = await fetch("/api/products", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  const data = await res.json();

  console.log(data);
};

function Products(obj: { items }) {
  const addToCart = useProducts((state: any) => state.addToCart);
  const setCart = useProducts((state: any) => state.setCart);
  let productsCart = useProducts((state: any) => state.cart);

  useEffect(() => {
    console.log("localStorage wacho", localStorage.getItem("my-cart"));
    let retrieveLocalStorage = JSON.parse(localStorage.getItem("my-cart"));

    //console.log("Retrieve Local Storage", retrieveLocalStorage);
    if (retrieveLocalStorage) {
      setCart(retrieveLocalStorage);
    }
  }, []);

  useEffect(() => {
    console.log("this little shit is making me waste time", productsCart);

    if (JSON.stringify(productsCart) != "[]") {
      localStorage.setItem("my-cart", JSON.stringify(productsCart));
    }
  });

  return (
    <div className="w-full flex-grow">
      <div className="w-[70%] mx-auto my-10 ">
        <div className="mb-10 flex justify-between">
          {" "}
          <div className="font-bold text-4xl">Nuestros productos</div>
          <div>
            <input
              className="border px-3 py-1"
              placeholder="Buscar"
              type="text"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {obj.items.map((item, i) => (
            <div
              key={i}
              className="hover:scale-[1.02] transition-all duration-200"
            >
              <a href={`/products/` + item._id}>
                <div className="flex flex-col">
                  <img
                    className="aspect-square object-cover object-center"
                    src={item.img}
                  ></img>
                  <div className="bg-black text-white drop-shadow p-5">
                    <p className="font-bold text-lg">{item.name}</p>
                    <p>Categorías: {item.categories}</p>
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
