/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState, Fragment } from "react";
import { useProducts } from "../../utils/zustand";
import Head from "next/head";
var ObjectId = require("mongodb").ObjectId;
import clientPromise from "mongodb.js";
import type { ColorOptionType, ProductType } from "src/utils/types";
import ProductView from "../components/product/ProductView";
import ProductForm from "../components/product/ProductForm";

export default function Id({
  item,
  color_options,
}: {
  item: [ProductType];
  color_options: [ColorOptionType];
}) {
  const addToCart = useProducts((state: any) => state.addToCart);
  let productsCart = useProducts((state: any) => state.cart);
  const setCart = useProducts((state: any) => state.setCart);
  const product: ProductType = item[0];
  const colors: [ColorOptionType] = color_options;

  const [edit, setEdit] = useState(false);

  useEffect(() => {
    //This useEffect hook is used to populate the useProducts hook, which holds the products in the cart in a global state for the whole application, but it gets erased when the page is refreshed, that's why I make use of localStorage, to persist the state.
    let retrieveLocalStorage = JSON.parse(localStorage.getItem("my-cart"));

    if (retrieveLocalStorage) {
      setCart(retrieveLocalStorage);
    }
  }, []);

  useEffect(() => {
    //For some reason, the client "loads" two times. The first time, the productsCart holds an empty array, thus replacing the localStorage "my-cart" for an empty array. To wait for the second load where the productsCart gets populated by the setCart (which is called in the usedEffect above with an empty dependecy array) method defined in useProducts I use this if condition.
    if (JSON.stringify(productsCart) != "[]") {
      localStorage.setItem("my-cart", JSON.stringify(productsCart));
    }
  });

  /**Returns listbox with the available options for each product. Each listbox modifies one of these three useState hooks: selectedSize, selectedColor_1, selectedColor_2. Each of these options always have a document in the database, but if the option does not apply to a product, the only document available will contain a "none" string as a value, which I then use to conditionally render the listboxs */

  return (
    <>
      <Head>
        {/*Microdata tags for facebook Pixel*/}
        <title>{product.name}</title>
        <meta property="og:title" content={product.name} />
        <meta property="product:retailer_item_id" content={product._id} />
        <meta property="og:description" content={product.description} />
        <meta property="product:availability" content="in stock" />
        <meta property="product:condition" content="new" />
        <meta property="product:category" content="furniture" />
        <meta property="google_product_category" content="furniture" />
        <meta
          property="product:price:amount"
          content={`${product.base_price}`}
        />
        <meta property="product:price:currency" content="ARS"></meta>

        <meta
          property="og:url"
          content={`https://www.klass.tienda/products/${product._id}`}
        />
        <meta
          property="og:image"
          content={`https://www.klass.tienda/${product.img[0]}`}
        />
        <meta property="product:brand" content="Klass" />
      </Head>

      <ProductView
        product={product}
        colors={colors}
        addToCart={addToCart}
        editProduct={setEdit}
      />
    </>
  );
}

export async function getStaticProps(context) {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library

  async function handler() {
    const client = await clientPromise;
    const db = client.db("klass_ecommerce");
    const collection = db.collection("products");

    return await collection
      .find({ _id: ObjectId(context.params.id) })
      .toArray();
  }

  async function getProductOptions() {
    const client = await clientPromise;
    const db = client.db("klass_ecommerce");
    const collection = db.collection("color_options");

    return await collection.find({}).toArray();
  }

  const item = await handler();

  const color_options = await getProductOptions();

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
      color_options: color_options.map((color) => {
        return {
          ...color,
          _id: color._id.toString(),
        };
      }),
    },
    revalidate: 300,
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
