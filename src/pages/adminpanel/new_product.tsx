/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import ProductForm from "../components/product/ProductForm";
import clientPromise from "@clientPromise";
import { ColorOptionType } from "src/utils/types";
import type { ProductType } from "src/utils/types";
import { getCategories } from "src/utils/utils";

export default function NewProduct({
  color_options,
  products,
}: {
  color_options: ColorOptionType[];
  products: ProductType[];
}) {
  return (
    <main className="relative min-h-[72vh] mx-20 ">
      <ProductForm
        productCategories={getCategories(products)}
        color_options={color_options}
      />
    </main>
  );
}

export async function getStaticProps() {
  async function handler() {
    const client = await clientPromise;
    const db = client.db("klass_ecommerce");
    const collection = db.collection("color_options");

    return await collection.find({}).toArray();
  }

  async function productHandler() {
    const client = await clientPromise;
    const db = client.db("klass_ecommerce");
    const collection = db.collection("products");

    return await collection.find({}).toArray();
  }

  const color_options = await handler();
  const products = await productHandler();

  return {
    props: {
      color_options: color_options.map((color) => {
        return {
          ...color,
          _id: color._id.toString(),
        };
      }),
      products: products.map((product) => {
        return {
          ...product,
          _id: product._id.toString(),
        };
      }),
    },
    revalidate: 300,
  };
}
