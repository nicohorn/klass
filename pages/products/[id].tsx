import React, { useContext, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";

import { useProducts } from "../layout/navbar";
var ObjectId = require("mongodb").ObjectId;
import clientPromise from "../../mongodb";

export default function Id({ item }) {
  const addToCart = useProducts((state: any) => state.addToCart);
  let productsCart = useProducts((state: any) => state.cart);

  const setCart = useProducts((state: any) => state.setCart);

  const router = useRouter();
  const id = router.query["id"];
  const product = item[0];

  const [cartShow, setCartShow] = useState(false);
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

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
    <section className="flex justify-center m-4 mt-8 flex-grow ">
      <div className="w-[30%]">
        <div className=" flex flex-col gap-5 mr-10 shadow-lg p-10">
          <h1 className="font-bold text-5xl">{product.name}</h1>
          <h2 className="text-2xl text-lime-700 font-bold">
            {typeof product.price == "number"
              ? formatter.format(product.price)
              : formatter.format(product.price[0])}
          </h2>
          <p className="">{product.description}</p>
          <div className="text-sm text-gray-600 italic ">{product.tags}</div>
          <button
            className="bg-black p-3  hover:bg-gray-700 text-white active:scale-95 transition-all duration-150"
            onClick={() => {
              addToCart(product._id);
            }}
          >
            Agregar al carrito
          </button>
        </div>
      </div>

      <div
        className="mb-10 aspect-[9/11] bg-cover bg-center rounded shadow-md"
        style={{ backgroundImage: `url(${product.img})` }}
      ></div>
    </section>
  );
}

export async function getStaticProps(context) {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  // const res = await fetch(
  //   `http://localhost:3000/api/products/${context.params.id}`
  // );
  async function handler() {
    const client = await clientPromise;
    const db = client.db("klass_ecommerce");
    const collection = db.collection("products");

    return await collection
      .find({ _id: ObjectId(context.params.id) })
      .toArray();
  }

  const item = await handler();

  // By returning { props: { items } }, the Products component
  // will receive `items` as a prop at build time
  return {
    props: {
      item: item.map((item) => {
        return {
          ...item,
          _id: item._id.toString(),
        };
      }),
    },
  };
}
export async function getStaticPaths() {
  async function handler() {
    const client = await clientPromise;
    const db = client.db("klass_ecommerce");
    const collection = db.collection("products");

    return await collection.find({}).toArray();
  }

  const products = await handler();

  function transformProduct() {
    return products.map((product) => {
      return {
        ...product,
        _id: product._id.toString(),
      };
    });
  }

  const product = transformProduct();

  const paths = product.map((product) => {
    return { params: { id: product._id } };
  });

  return {
    paths,
    fallback: false, // See the "fallback" section below
  };
}
