/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState, Fragment } from "react";
import { useProducts } from "../../utils/zustand";
import Head from "next/head";
var ObjectId = require("mongodb").ObjectId;
import clientPromise from "mongodb.js";
import SimpleImageSlider from "react-simple-image-slider";
import type { ColorOptionType, OptionType, ProductType } from "src/utils/types";
import OptionsListbox from "../components/OptionsListbox";
import ProductView from "../components/product/ProductView";

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
  /**This functions retrieves an object with 3 properties: size options, color 1 options and color 2 options. It's a helper function to easily access and use the product options */
  const size_options = product.options.find((optionList) => {
    return optionList.name === "size";
  })?.elements;
  const color_1_options = product.options.find((optionList) => {
    return optionList.name === "color_1";
  })?.elements;
  const color_2_options = product.options.find((optionList) => {
    return optionList.name === "color_2";
  })?.elements;
  const style_options = product.options.find((optionList) => {
    return optionList.name === "style";
  })?.elements;
  const model_options = product.options.find((optionList) => {
    return optionList.name === "model";
  })?.elements;

  //This useState hook holds one of the options with its price that was selected from the product (in case of having an option to chose, e.g. S, M, L, etc)
  const [selectedSize, setSelectedSize] = useState<OptionType>(
    size_options ? size_options[0] : { value: "none", multiplier: 1 }
  );
  const [selectedColor_1, setSelectedColor_1] = useState<OptionType>(
    color_1_options ? color_1_options[0] : { value: "none", multiplier: 1 }
  );
  const [selectedColor_2, setSelectedColor_2] = useState<OptionType>(
    color_2_options ? color_2_options[0] : { value: "none", multiplier: 1 }
  );

  const [selectedStyle, setSelectedStyle] = useState<OptionType>(
    style_options ? style_options[0] : { value: "none", multiplier: 1 }
  );

  const [selectedModel, setSelectedModel] = useState<OptionType>(
    model_options ? model_options[0] : { value: "none", multiplier: 1 }
  );

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

  /**Helper function to calculate the total price of a product with its selected options */
  function totalPrice() {
    const total =
      product.base_price +
      (selectedSize.multiplier * product.base_price - product.base_price) +
      (selectedColor_1.multiplier * product.base_price - product.base_price) +
      (selectedColor_2.multiplier * product.base_price - product.base_price) +
      (selectedStyle.multiplier * product.base_price - product.base_price) +
      (selectedModel.multiplier * product.base_price - product.base_price);

    const totalToNeareastFive = Math.ceil(total / 5) * 5;

    return totalToNeareastFive;
  }

  /**Returns listbox with the available options for each product. Each listbox modifies one of these three useState hooks: selectedSize, selectedColor_1, selectedColor_2. Each of these options always have a document in the database, but if the option does not apply to a product, the only document available will contain a "none" string as a value, which I then use to conditionally render the listboxs */
  function listboxOptions() {
    return (
      <div className="flex gap-5 flex-col  ">
        <OptionsListbox
          title="Tamaño (en metros)"
          selectedOption={selectedSize}
          setSelectedOption={setSelectedSize}
          options={size_options}
        />

        <OptionsListbox
          title="Color 1"
          selectedOption={selectedColor_1}
          setSelectedOption={setSelectedColor_1}
          options={color_1_options}
          colors={colors}
        />

        <OptionsListbox
          title="Color 2"
          selectedOption={selectedColor_2}
          setSelectedOption={setSelectedColor_2}
          options={color_2_options}
          colors={colors}
        />

        <OptionsListbox
          title="Estilo"
          selectedOption={selectedStyle}
          setSelectedOption={setSelectedStyle}
          options={style_options}
        />
        <OptionsListbox
          title="Modelo"
          selectedOption={selectedModel}
          setSelectedOption={setSelectedModel}
          options={model_options}
        />
      </div>
    );
  }

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
        selectedSize={selectedSize}
        selectedColor_1={selectedColor_1}
        selectedColor_2={selectedColor_2}
        selectedModel={selectedModel}
        selectedStyle={selectedStyle}
        listboxOptions={listboxOptions()}
        addToCart={addToCart}
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
