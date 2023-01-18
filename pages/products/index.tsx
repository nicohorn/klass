import React from "react";
import { useEffect, useState } from "react";
import { useProducts } from "../../zustand";
import clientPromise from "@clientPromise";
import gsap from "gsap";

function Products({ items }) {
  const setCart = useProducts((state: any) => state.setCart);
  let productsCart = useProducts((state: any) => state.cart);
  const [category, setCategory] = useState("");
  const [active, setActive] = useState(null);

  useEffect(() => {
    let retrieveLocalStorage = JSON.parse(localStorage.getItem("my-cart"));
    if (retrieveLocalStorage) {
      setCart(retrieveLocalStorage);
    }
  }, []);

  useEffect(() => {
    gsap.fromTo(
      "#product",
      { opacity: 0 },
      { opacity: 1, duration: 0.3, delay: 0.3, ease: "power1.out" }
    );
  }, [category]);

  useEffect(() => {
    if (JSON.stringify(productsCart) != "[]") {
      localStorage.setItem("my-cart", JSON.stringify(productsCart));
    }
  });

  function getCategories() {
    const categories = items.map((item) => {
      let categories = item.categories.toString().split("/");
      categories.shift();
      return categories;
    });

    let finalArray = [].concat.apply([], categories);

    //Remove duplicates from the array
    finalArray = finalArray.filter(
      (item, index) => finalArray.indexOf(item) === index
    );

    return finalArray;
  }

  function getItemsByCategory(cat) {
    return items.filter((item) => {
      return item.categories.toString().includes(cat);
    });
  }
  return (
    <div className="w-full flex-grow bg-neutral-100">
      <div className="md:w-[70%] p-4 mx-auto mt-10 mb-28">
        <div className="mb-10 flex justify-between lg:flex-row flex-col gap-4 items-center border-b-2 border-gray-300">
          {" "}
          <div className="font-bold text-xl md:text-5xl text-center lg:text-left pb-6 ">
            Nuestros productos
          </div>
        </div>
        <div className="text-center mb-12 flex flex-wrap justify-start gap-5">
          {getCategories().map((cat, i) => {
            return (
              <span
                key={i}
                onClick={() => {
                  setCategory(cat);
                  setActive(i);
                }}
                className={
                  active == i
                    ? `cursor-pointer rounded-md font-semibold  text-white px-3 py-1 drop-shadow-[3px_3px_5px_rgba(0,0,0,0.20)] bg-green-600 transition-all duration-100 shadow-md `
                    : "cursor-pointer rounded-md font-semibold  text-black px-3 py-1 bg-white transition-all duration-100  shadow-inner border border-gray-100 hover:border-green-600"
                }
              >
                {cat}
              </span>
            );
          })}
          <span
            onClick={() => {
              setCategory("");
              setActive(null);
            }}
            className="cursor-pointer rounded-md font-semibold hover:scale-105 text-white px-3 py-1 bg-gray-400 transition-all duration-100 active:scale-100 border-2 border-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.7}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </span>
        </div>

        <div className="grid lg:grid-cols-2  auto-rows-auto 2xl:grid-cols-4 gap-8">
          {getItemsByCategory(category).map((item, i) => (
            <span id="product" key={i}>
              <div className=" border-2 rounded-dm border-neutral-900 border-opacity-0 hover:border-opacity-100 transition-all duration-200 hover:scale-105 active:scale-95 hover:drop-shadow-[8px_8px_5px_rgba(0,0,0,0.45)] group ">
                <a href={`/products/` + item._id}>
                  <div className="flex flex-col ">
                    <img
                      className="aspect-square object-cover object-center rounded-t-sm"
                      src={item.img}
                    ></img>

                    <div className="bg-neutral-900 text-white drop-shadow p-5 rounded-b-sm">
                      <meta property="og:title" content={item.name} />
                      <meta
                        property="product:retailer_item_id"
                        content={item._id}
                      />
                      <meta
                        property="og:description"
                        content={item.description}
                      />
                      <meta
                        property="product:availability"
                        content="in stock"
                      />
                      <meta property="product:condition" content="new" />
                      <meta
                        property="product:price:amount"
                        content={`${
                          typeof item.price == "number"
                            ? item.price
                            : typeof item.price[0] == "object"
                            ? item.price
                            : 0
                        }`}
                      />
                      <meta
                        property="product:price:currency"
                        content="ARS"
                      ></meta>

                      <meta
                        property="og:url"
                        content={`https://www.klass.tienda/products/${item._id}`}
                      />
                      <meta
                        property="og:image"
                        content={`https://www.klass.tienda/${item.img}`}
                      />
                      <meta property="product:brand" content="Klass" />
                      <p className="font-bold text-lg">{item.name}</p>
                      <p className="text-xs">Categorías: {item.categories}</p>
                    </div>
                  </div>
                </a>
              </div>
            </span>
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
