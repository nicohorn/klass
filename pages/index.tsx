import React from "react";
import { useEffect, useState, useLayoutEffect } from "react";
import { useProducts } from "../zustand";
import clientPromise from "@clientPromise";
import { useUser } from "@auth0/nextjs-auth0";

type userProfile = {
  userId: string;
  user_name: string;
};

const createProfile = async (userProfile: userProfile) => {
  const res = await fetch("http://localhost:3000/api/profiles", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userProfile),
  })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      console.log("Se creó el siguiente usuario: ", json);
    });
};

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

  // setInterval(() => {
  //   console.log(user?.sub);
  // }, 5000);

  return (
    <div className="w-full h-[75vh]">
      <div className="flex h-full lg:flex-row flex-col">
        {products.slice(1, 6).map((item, i) => (
          <div
            key={i}
            style={{ backgroundImage: `url(${item.img[0]})` }}
            className="flex-[0.5] bg-cover bg-center bg-no-repeat hover:flex-[0.6] transition-all duration-300 group grid hover:p-20 drop-shadow-[8px_8px_20px_rgba(0,0,0,0.75)]"
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
