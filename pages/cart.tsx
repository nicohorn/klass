import React from "react";
import { useState, useEffect } from "react";
import { useProducts } from "./layout/navbar";
import clientPromise from "../mongodb";
import { Disclosure, Transition } from "@headlessui/react";
import { ChevronRightIcon, ChevronUpIcon } from "@heroicons/react/20/solid";

export default function Cart({ items }) {
  const productsCart = useProducts((state: any) => state.cart);
  const setCart = useProducts((state: any) => state.setCart);
  const removeFromCart = useProducts((state: any) => state.removeFromCart);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

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

  const filteredProducts = () => {
    //Function to "join" the products retrieved from the db and the products in cart (which only have id and count properties, while the products form the database have all the rest of the info)
    return productsCart.map((product) => {
      return { ...items.find((item) => item._id === product.id), ...product };
    });
  };

  let transformedProducts = filteredProducts();

  //console.log("transformedproducts", transformedProducts);

  const totalCartPrice = () => {
    let sum = 0;
    for (let i = 0; i < transformedProducts.length; i++) {
      sum += transformedProducts[i].price * transformedProducts[i].count;
    }

    return sum;
  };

  return (
    <main className="mx-auto  my-10  w-screen px-2">
      <div className="md:w-[50%] mx-auto p-5 border bg-stone-100 rounded-sm shadow-md">
        <div className="pb-4 text-2xl font-bold justify-between flex items-center">
          <div>Mi carrito</div>
          <div>
            {" "}
            <div
              id="cart-icon"
              className="text-white cursor-pointer flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.3"
                stroke="black"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
              <div id="cart-number" className="text-xs text-center">
                +1
              </div>
            </div>
          </div>
        </div>
        {transformedProducts.map((product, i) => {
          let categories = product.categories.toString().split("/");
          return (
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="  flex w-full hover:shadow-md items-center justify-between bg-white px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-emerald-100 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75 border transition-all duration-150 mb-4">
                    <div
                      key={i}
                      className=" flex grow gap-5 justify-between items-center"
                    >
                      <div className="flex gap-2 grow items-center">
                        <div className="font-semibold lg:text-lg">
                          {product.name}
                        </div>
                        <div>x {product.count}</div>
                      </div>
                      <div className="mr-2">
                        Total:{" "}
                        {typeof product.price == "number"
                          ? formatter.format(product.price * product.count)
                          : typeof product.price[0] == "object"
                          ? formatter.format(
                              product.price[0].price * product.count
                            )
                          : product.price[0] * product.count}
                      </div>
                    </div>

                    <ChevronUpIcon
                      className={`${
                        open ? "" : "rotate-180 transform"
                      } h-5 w-5 text-green-500`}
                    />
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Disclosure.Panel className=" mb-4 flex flex-col px-4 pt-4 pb-2 text-sm text-gray-600">
                      <div key={i} className="flex gap-2">
                        <div>
                          {" "}
                          <span className="font-bold">
                            Precio individual:
                          </span>{" "}
                          {typeof product.price == "number"
                            ? formatter.format(product.price)
                            : typeof product.price[0] == "object"
                            ? formatter.format(product.price[0].price)
                            : product.price[0]}
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          <div className="font-bold">Categorías: </div>
                          {categories.map((category, ii) => {
                            return <p key={ii}>{category}</p>;
                          })}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          removeFromCart(product._id);
                          localStorage.setItem("my-cart", JSON.stringify(""));
                        }}
                        className="hover:bg-red-500 transition-all duration-150 self-end p-2 mt-4 text-white font-bold rounded-md bg-red-700"
                      >
                        Quitar del carrito
                      </button>
                    </Disclosure.Panel>
                  </Transition>
                </>
              )}
            </Disclosure>
          );
        })}
        <div className="flex justify-end text-lg mr-2 mt-5 font-bold text-green-500">
          <span className="mr-3">Total:</span>
          <span>{formatter.format(totalCartPrice())}</span>
        </div>
      </div>
    </main>
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
