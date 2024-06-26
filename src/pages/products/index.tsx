import React from "react";
import { useEffect, useState } from "react";
import { useProducts } from "../../utils/zustand";
import clientPromise from "../../../mongodb";
import { Search } from "@mui/icons-material";
import fuzzysort from "fuzzysort";
import { formatter } from "src/utils/utils";
import type { ProductType } from "src/utils/types";
import Image from "next/image";
import { getCategories } from "src/utils/utils";
import { useUser } from "@auth0/nextjs-auth0/client";
import { isAdmin } from "src/utils/isAdmin";
import { useRouter } from "next/router";

function Products({ items }: { items: ProductType[] }) {
  const router = useRouter()
  const setCart = useProducts((state: any) => state.setCart);
  let productsCart = useProducts((state: any) => state.cart);
  const [active, setActive] = useState(null);

  const [searchString, setSearchString] = useState(router.query.search?.toString() ?? '');

  const { user, error, isLoading } = useUser();

  useEffect(() => {
    if (router.query.search) {
      const search = router.query.search.toString()
      setSearchString(search)
      const index = getCategories(items).findIndex(c => c === search)
      if (index >= 0) {
        setActive(index)
      }
    }
  }, [router.query.search])

  useEffect(() => {
    const newurl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?search=${searchString}`;
    window.history.replaceState({path:newurl},'',newurl);
  }, [searchString])

  //This useEffect is used to retrieve the cart from the local storage if it exists, and then set it in the cart state (zustand).
  useEffect(() => {
    let retrieveLocalStorage = JSON.parse(localStorage.getItem("my-cart"));
    if (retrieveLocalStorage) {
      setCart(retrieveLocalStorage);
    }
  }, [setCart]);

  //This useEffect is used to save the cart in the local storage if the cart is not empty.
  useEffect(() => {
    if (JSON.stringify(productsCart) != "[]") {
      localStorage.setItem("my-cart", JSON.stringify(productsCart));
    }
  });

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

  const deleteProduct = async (product: ProductType) => {
    //Once the client is in the cart page, he can delete some products from the cart if needed or wanted, and then he can chose to complete an order, which posts a new order document to mongodb. This is the function that does it.

    await fetch("/api/products/delete_product", {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {});
  };

  return (
    <div className="w-full flex-grow bg-primary p-5 lg:p-0">
      <div className="md:mx-20 py-5">
        <div className="mb-10 flex flex-col lg:flex-row border-b border-yellow-500 justify-center">
          {" "}
          <div className="uppercase flex flex-col xl:flex-row gap-4 font-bold  text-center text-white pb-2 border-none flex-grow">
            <p className="text-2xl md:text-5xl" id="Título">
              Nuestros productos
            </p>
            <button
              onClick={() => {
                document.getElementById("input-search").focus();
              }}
              className="cursor-pointer"
            >
              <Search
                className={`hover:fill-yellow-400 mb-5 md:mb-0  scale-125 hover:scale-150 transition-all duration-150 `}
              ></Search>
            </button>
            <input
              onChange={(e) => {
                setSearchString(e.target.value);
                setActive(null);
              }}
              value={searchString}
              id="input-search"
              className="placeholder:pl-1 text-white flex-grow w-auto outline-none text-lg opacity-100 placeholder:transition-all placeholder:duration-150 bg-primary placeholder:opacity-30 focus:placeholder:opacity-90 "
              placeholder="Ingresá el nombre o categoría del producto que buscás"
            />
          </div>
        </div>
        <div className="hidden flex-col lg:flex-row justify-between gap-5 md:flex">
          <span className="text-2xl text-white">Categorías:</span>
          <div className="text-center mb-12 flex flex-wrap justify-start gap-5">
            {getCategories(items).map((cat, i) => {
              return (
                <span
                  key={i}
                  onClick={() => {
                    setSearchString(cat);
                    setActive(i);
                  }}
                  className={
                    active == i
                      ? "cursor-pointer  font-semibold  text-black px-3 py-1  bg-yellow-400 transition-all duration-100 shadow-md"
                      : "cursor-pointer  font-semibold  text-white px-3 py-1  transition-all duration-100   border border-white hover:border-yellow-400 "
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
              className="cursor-pointer font-semibold hover:scale-110 self-center text-white  py-1 transition-all duration-100 active:scale-100  "
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
              <span className="relative" id="product" key={i}>
                <div className="delay-150 border-opacity-0 w-[80%] sm:w-full mx-auto transition-all duration-150 active:scale-95 hover:drop-shadow-[8px_8px_5px_rgba(0,0,0,0.45)] group ">
                  {isAdmin(user?.sub) ? (
                    <button
                      onClick={() => {
                        deleteProduct(item);
                      }}
                      type="button"
                      title="Eliminar producto"
                      className="absolute z-[99] top-2 left-2 "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.7}
                        stroke="white"
                        className="w-8 h-8  md:group-hover:scale-[1.2] drop-shadow-lg hover:bg-black/70 p-1 transition-all duration-300"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>
                  ) : null}
                  <a href={`/products/` + item._id}>
                    <div className="flex flex-col ">
                      <div className="  aspect-[4/5] md:group-hover:scale-[1.02] bg-cover relative bg-center transition-all duration-300  object-cover object-center  rounded-t-sm">
                        <Image
                          className="  aspect-[4/5] md:group-hover:scale-[1.02] bg-cover relative bg-center transition-all duration-300  object-cover object-center  rounded-md"
                          width={500}
                          height={500}
                          alt="Imagen del producto"
                          src={item.img[0]}
                          unoptimized={true}
                        ></Image>

                        <div className="absolute w-full bottom-0  transition-all duration-300 delay-300">
                          <p className=" px-4 my-3 uppercase font-bold transition-all duration-300  text-white  drop-shadow-[0px_0px_6px_rgba(0,0,0,0.75)] ">
                            {item.name}
                          </p>
                          <span className="px-5 -translate-x-1 max-w-fit mb-2 py-1 font-bold bg-yellow-300  text-black drop-shadow-[0px_0px_6px_rgba(0,0,0,0.25)] flex items-center ">
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
    revalidate: 1,
  };
}

export default Products;
