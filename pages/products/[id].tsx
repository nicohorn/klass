import React, { useEffect, useState, Fragment } from "react";

import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useProducts } from "../../zustand";
import Head from "next/head";

var ObjectId = require("mongodb").ObjectId;

import clientPromise from "../../mongodb";

export default function Id({ item }) {
  const addToCart = useProducts((state: any) => state.addToCart);
  let productsCart = useProducts((state: any) => state.cart);
  const setCart = useProducts((state: any) => state.setCart);
  const product = item[0];
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

  //This useState hook holds one of the options with its price that was selected from the product (in case of having an option to chose, e.g. S, M, L, etc)
  const [selected, setSelected] = useState(item[0].price[0]);
  const [selectedSize, setSelectedSize] = useState(
    productOptions().size_options[0]
  );
  const [selectedColor_1, setSelectedColor_1] = useState(
    productOptions().color_1_options[0]
  );
  const [selectedColor_2, setSelectedColor_2] = useState(
    productOptions().color_2_options[0]
  );

  console.log(selectedSize);

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

  /**This functions retrieves an object with 3 properties: size options, color 1 options and color 2 options. It's a helper function to easily access and use the product options */
  function productOptions() {
    const size_options = product.options[0]["size"];
    const color_1_options = product.options[1]["color_1"];
    const color_2_options = product.options[2]["color_2"];

    return {
      size_options: size_options,
      color_1_options: color_1_options,
      color_2_options: color_2_options,
    };
  }

  /**Helper function to calculate the total price of a product with its selected options */
  function totalPrice() {
    const total =
      product.base_price +
      (selectedSize.multiplier * product.base_price - product.base_price) +
      (selectedColor_1.multiplier * product.base_price - product.base_price) +
      (selectedColor_2.multiplier * product.base_price - product.base_price);

    const totalToNeareastFive = Math.ceil(total / 5) * 5;

    return formatter.format(totalToNeareastFive);
  }

  /**Returns listbox with the available options for each product. Each listbox modifies one of these three useState hooks: selectedSize, selectedColor_1, selectedColor_2. Each of these options always have a document in the database, but if the option does not apply to a product, the only document available will contain a "none" string as a value, which I then use to conditionally render the listboxs */
  function listboxOptions() {
    return (
      <div className="flex gap-5 ">
        {selectedSize.value == "none" ? null : (
          <div className="flex-shrink">
            <p className="italic text-sm">Tamaño (en metros)</p>
            <Listbox value={selectedSize} onChange={setSelectedSize}>
              <div className="relative mt-1 flex-auto">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate">{selectedSize.value}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute mt-1 z-50 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {productOptions().size_options.map((size, i) => (
                      <Listbox.Option
                        key={i}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-amber-100 text-amber-900"
                              : "text-gray-900"
                          }`
                        }
                        value={size}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              <div className="flex justify-between mr-2">
                                <span>{size.value}</span>
                              </div>
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
        )}

        <div className="flex-grow">
          <p className="italic text-sm">Color 1</p>
          <Listbox value={selectedColor_1} onChange={setSelectedColor_1}>
            <div className="relative mt-1 flex-auto">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="block truncate">{selectedColor_1.value}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 z-50 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {productOptions().color_1_options.map((color_1, i) => (
                    <Listbox.Option
                      key={i}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active
                            ? "bg-amber-100 text-amber-900"
                            : "text-gray-900"
                        }`
                      }
                      value={color_1}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            <div className="flex justify-between mr-2">
                              <span>{color_1.value}</span>
                            </div>
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
        {selectedColor_2.value == "none" ? null : (
          <div className="flex-grow">
            <p className="italic text-sm">Color 2</p>
            <Listbox value={selectedColor_2} onChange={setSelectedColor_2}>
              <div className="relative mt-1 flex-auto">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate">
                    {selectedColor_2.value}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute mt-1 z-50 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {productOptions().color_2_options.map((color_2, i) => (
                      <Listbox.Option
                        key={i}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-amber-100 text-amber-900"
                              : "text-gray-900"
                          }`
                        }
                        value={color_2}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              <div className="flex justify-between mr-2">
                                <span>{color_2.value}</span>
                              </div>
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
        )}
      </div>
    );
  }

  /**This is a helper function to return the price and the option selected of the product in case of having options. If the product doesn't have options, it will return its individual price and an option (called size because that's how it's defined on the db) with a value of null. */
  let priceSize = (): { price: number; size: string } => {
    let price: number, size: string;
    if (typeof selected == "undefined") {
      price = product.price;
      size = null;
    } else {
      price = selected.price;
      size = selected.size;
    }

    return { price: price, size: size };
  };

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
          content={`${
            typeof product.price == "number"
              ? product.price
              : typeof product.price[0] == "object"
              ? selected.price
              : 1
          }`}
        />
        <meta property="product:price:currency" content="ARS"></meta>

        <meta
          property="og:url"
          content={`https://www.klass.tienda/products/${product._id}`}
        />
        <meta
          property="og:image"
          content={`https://www.klass.tienda/${product.img}`}
        />
        <meta property="product:brand" content="Klass" />
      </Head>

      <section className="flex justify-center lg:h-[70vh] p-6 flex-grow lg:flex-row flex-col lg:px-10 sm:px-32  gap-5 ">
        <div className="w-full xl:w-[40%] h-full z-50">
          <div className=" flex flex-col gap-5   mr-0 shadow-lg p-5 lg:p-10">
            <h1 className="font-bold text-3xl lg:text-3xl">{product.name}</h1>
            <h2 className="text-2xl text-lime-700 font-bold">{totalPrice()}</h2>

            <p className="text-md whitespace-pre-wrap leading-5 ">
              {product.description}
            </p>

            <div>
              {/* {typeof product.price == "object" &&
              product.price != "Presupuestar"
                ? productOptionsListBox()
                : null} */}{" "}
              {listboxOptions()}
            </div>

            <button
              className="bg-green-500 p-3 font-semibold rounded-sm w-[100%]  self-center hover:bg-green-600 text-white active:scale-95 transition-all duration-150 hover:drop-shadow-[3px_3px_1px_rgba(0,0,0,0.25)]"
              onClick={() => {
                addToCart(product._id, priceSize().price, priceSize().size);
              }}
            >
              Agregar al carrito
            </button>
          </div>
        </div>
        <div className="h-full">
          <img
            className=" h-full  object-cover object-center rounded-sm drop-shadow-[5px_5px_5px_rgba(0,0,0,0.20)]"
            src={`${product.img}`}
          ></img>
        </div>
      </section>
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
