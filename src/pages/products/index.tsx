import React from "react";
import { useEffect, useState, useRef } from "react";
import { useProducts } from "../../utils/zustand";
import clientPromise from "../../../mongodb";
import gsap from "gsap";
import { Search } from "@mui/icons-material";
import fuzzysort from "fuzzysort";
import { formatter } from "utils";

function Products({ items }) {
  const setCart = useProducts((state: any) => state.setCart);
  let productsCart = useProducts((state: any) => state.cart);
  const [category, setCategory] = useState("");
  const [active, setActive] = useState(null);
  const [search, setSearch] = useState(false);
  const [searchString, setSearchString] = useState("");

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

  function getItemsBySearch(search: string) {
    const results = fuzzysort.go(search, items, {
      keys: ["name", "categories"],
    });

    if (search) {
      return results.map((result) => {
        return result.obj;
      });
    } else {
      return items;
    }
  }

  return (
    <div className="w-full flex-grow bg-primary p-5 lg:p-0">
      <div className="md:mx-20 py-5">
        <div className="mb-10 flex justify-between lg:flex-row flex-col gap-4 w-full items-center border-0 lg:border-b border-white">
          {" "}
          <div className="uppercase lg:items-end items-center flex flex-col lg:flex-row gap-4 font-bold text-2xl md:text-5xl text-center text-white lg:text-left pb-2 lg:border-none border-b">
            <p>Nuestros productos</p>
            <button
              onClick={() => {
                setSearch(!search);
              }}
              className="cursor-pointer"
            >
              <Search className="hover:fill-yellow-500 mb-5 md:mb-0  scale-125 hover:scale-150 transition-all duration-150"></Search>
            </button>
            <div className="flex-1 relative lg:w-[26vw] w-full">
              <input
                onChange={(e) => {
                  setSearchString(e.target.value);
                  setActive(null);
                }}
                id="input-search"
                className={`text-primary lg:-translate-y-[110%]  -top-5 md:-top-0  -translate-x-[50%] lg:translate-x-0 absolute px-2 outline-none text-lg opacity-100 transition-all duration-200 ${
                  search ? "width-animation" : "width-animation-reverse"
                } `}
                placeholder="Ingresá el nombre del producto que estás buscando"
              />
            </div>
          </div>
        </div>
        <div className="hidden flex-col lg:flex-row justify-between gap-5 md:flex">
          <span className="text-2xl text-white">Categorías:</span>
          <div className="text-center mb-12 flex flex-wrap justify-start gap-5">
            {getCategories().map((cat, i) => {
              return (
                <span
                  key={i}
                  onClick={() => {
                    setSearchString(cat);
                    setActive(i);
                  }}
                  className={
                    active == i
                      ? "cursor-pointer  font-semibold  text-white px-3 py-1  bg-yellow-600 transition-all duration-100 shadow-md"
                      : "cursor-pointer  font-semibold  text-white px-3 py-1  transition-all duration-100   border border-white hover:border-yellow-600 "
                  }
                >
                  {cat}
                </span>
              );
            })}
            <span
              onClick={() => {
                setSearchString("");
                setActive(null);
              }}
              className="cursor-pointer font-semibold hover:scale-110 self-center text-white  py-1transition-all duration-100 active:scale-100  "
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
        </div>

        {getItemsBySearch(searchString).length >= 0 && (
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 auto-rows-auto 2xl:grid-cols-4 gap-5 sm:gap-8">
            {getItemsBySearch(searchString).map((item, i) => (
              <span id="product" key={i}>
                <div className="delay-150 border-opacity-0 w-[80%] sm:w-full mx-auto transition-all duration-150 active:scale-95 hover:drop-shadow-[8px_8px_5px_rgba(0,0,0,0.45)] group ">
                  <a href={`/products/` + item._id}>
                    <div className="flex flex-col ">
                      <div
                        className="rounded-md  aspect-[4/5] md:group-hover:scale-105 bg-cover relative bg-center transition-all duration-300  object-cover object-center  rounded-t-sm "
                        style={{ backgroundImage: `url(${item.img[0]})` }}
                      >
                        <div className="absolute w-full bottom-0  transition-all duration-300 delay-300">
                          <p className=" px-4 my-3 uppercase font-bold md:group-hover:text-2xl transition-all duration-300  text-white  drop-shadow-[0px_0px_6px_rgba(0,0,0,0.75)] ">
                            {item.name}
                          </p>
                          <p className="px-5 -translate-x-1 max-w-fit mb-2 py-1 font-bold bg-yellow-300  text-black drop-shadow-[0px_0px_6px_rgba(0,0,0,0.25)] flex items-center rounded-md">
                            {formatter.format(item.base_price)}
                            <div className=" flex flex-col">
                              {" "}
                              <span className="text-xs font-normal ml-2">
                                Precio
                              </span>
                              <span className="text-xs font-normal ml-2">
                                base
                              </span>
                            </div>
                          </p>
                          <span className="text-sm p-4 md:block hidden bg-black/60 text-white transition-all delay-500 duration-200  absolute bottom-full pointer-events-none opacity-0 group-hover:opacity-100">
                            {item.description}
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              </span>
            ))}
          </div>
        )}
        {getItemsBySearch(searchString).length <= 0 && (
          <div className="text-white flex items-center justify-center text-xl font-bold h-[50vh]">
            No se encontraron resultados
          </div>
        )}
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

    return await collection.find({}).sort({ categories: 1 }).toArray();
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
