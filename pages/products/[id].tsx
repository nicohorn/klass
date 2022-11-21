import React, { useContext, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Cart from "../components/cart";
import { useProducts } from "../layout/navbar";

export default function Id({ item }) {
  const addToCart = useProducts((state: any) => state.addToCart);
  let productsCart = useProducts((state: any) => state.cart);

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

  useEffect(() => {});

  return (
    <section className="flex justify-center m-4 mt-8 flex-grow ">
      <div className="w-[30%] flex flex-col gap-3 mr-20">
        <h1 className="font-bold text-5xl ">{product.name}</h1>
        <h2 className="text-2xl text-lime-700 font-bold">
          {typeof product.price == "number"
            ? formatter.format(product.price)
            : formatter.format(product.price[0])}
        </h2>
        <p className="">{product.description}</p>
        <div className="text-sm text-gray-600 italic">{product.tags}</div>
        <button
          onClick={() => {
            //addToCart(product._id);
          }}
        >
          Agregar al carrito
        </button>
        <Cart state={cartShow} />
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
  const res = await fetch(
    `http://localhost:3000/api/products/${context.params.id}`
  );
  const item = await res.json();

  // By returning { props: { items } }, the Products component
  // will receive `items` as a prop at build time
  return {
    props: {
      item,
    },
  };
}
export async function getStaticPaths() {
  const res = await fetch(`http://localhost:3000/api/products/`);
  const product = await res.json();

  const paths = product.map((product) => {
    return { params: { id: product._id } };
  });

  return {
    paths,
    fallback: false, // See the "fallback" section below
  };
}
