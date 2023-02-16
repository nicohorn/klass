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

  //Kinda dictionary to map names of colors to their respective image.
  const colors = [
    { name: "Enchapado Paraíso", img: "/images/colores_enchapadoparaiso.jpg" },
    { name: "Negro", img: "/images/colores_negro.jpg" },
    { name: "Blanco", img: "/images/colores_blanco.jpg" },
    { name: "Grafito", img: "/images/colores_grafito.jpg" },
    { name: "Himalaya", img: "/images/colores_himalaya.jpg" },
    { name: "Tribal", img: "/images/colores_tribal.jpg" },
    { name: "Safari", img: "/images/colores_safari.jpg" },
    { name: "Tuareg", img: "/images/colores_tuareg.jpg" },
    { name: "Helsinki", img: "/images/colores_helsinki.jpg" },
    { name: "Roble Escandinavo", img: "/images/colores_robleescandinavo.jpg" },
    { name: "Teka Oslo", img: "/images/colores_tekaoslo.jpg" },
    { name: "Seda Giorno", img: "/images/colores_sedagiorno.jpg" },
    { name: "Seda Notte", img: "/images/colores_sedanotte.jpg" },
    { name: "Lino Chiaro", img: "/images/colores_linochiaro.jpg" },
  ];

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

  const [selectedStyle, setSelectedStyle] = useState({
    value: "none",
    multiplier: 1,
  });

  const [selectedModel, setSelectedModel] = useState({
    value: "none",
    multiplier: 1,
  });

  const [imageIndex, setImageIndex] = useState(-1);

  useEffect(() => {
    //This useEffect hook is used to populate the useProducts hook, which holds the products in the cart in a global state for the whole application, but it gets erased when the page is refreshed, that's why I make use of localStorage, to persist the state.
    let retrieveLocalStorage = JSON.parse(localStorage.getItem("my-cart"));

    if (retrieveLocalStorage) {
      setCart(retrieveLocalStorage);
    }

    if (product.options[3]) {
      if (product.options[3]["style"]) {
        setSelectedStyle(productOptions().style_options[0]);
      } else if (product.options[3]["model"]) {
        setSelectedModel(productOptions().model_options[0]);
      }
    }

    setImageIndex(0);
  }, []);

  useEffect(() => {
    //For some reason, the client "loads" two times. The first time, the productsCart holds an empty array, thus replacing the localStorage "my-cart" for an empty array. To wait for the second load where the productsCart gets populated by the setCart (which is called in the usedEffect above with an empty dependecy array) method defined in useProducts I use this if condition.
    if (JSON.stringify(productsCart) != "[]") {
      localStorage.setItem("my-cart", JSON.stringify(productsCart));
    }

    console.log("re render");
  });

  /**This functions retrieves an object with 3 properties: size options, color 1 options and color 2 options. It's a helper function to easily access and use the product options */
  function productOptions() {
    const size_options = product.options[0]["size"];
    const color_1_options = product.options[1]["color_1"];
    const color_2_options = product.options[2]["color_2"];
    if (product.options[3]) {
      if (product.options[3]["style"]) {
        const style_options = product.options[3]["style"];
        return {
          size_options: size_options,
          color_1_options: color_1_options,
          color_2_options: color_2_options,
          style_options: style_options,
        };
      } else {
        const model_options = product.options[3]["model"];
        return {
          size_options: size_options,
          color_1_options: color_1_options,
          color_2_options: color_2_options,
          model_options: model_options,
        };
      }
    } else {
      return {
        size_options: size_options,
        color_1_options: color_1_options,
        color_2_options: color_2_options,
      };
    }
  }

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
        {selectedSize.value == "none" ? null : (
          <div className="w-full">
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
        {selectedColor_1.value == "none" ? null : (
          <div className="">
            <p className="italic text-sm">Color 1</p>
            <Listbox value={selectedColor_1} onChange={setSelectedColor_1}>
              <div className="relative mt-1 flex-auto">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate">
                    {selectedColor_1.value}
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
                              <div className="flex justify-between mr-2 items-center">
                                <span>{color_1.value}</span>
                                {color_1.img ? (
                                  <img
                                    className="w-10"
                                    src={`${color_1.img}`}
                                  ></img>
                                ) : (
                                  <img
                                    className="w-10 drop-shadow-lg"
                                    src={`${
                                      colors.find(
                                        (color) => color_1.value === color.name
                                      )?.img
                                    }`}
                                  ></img>
                                )}
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

        {selectedColor_2.value == "none" ? null : (
          <div className="">
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
                              <div className="flex items-center justify-between mr-2">
                                <span className="whitespace-pre-line">
                                  {color_2.value}
                                </span>
                                {color_2.img ? (
                                  <img
                                    className="w-10"
                                    src={`${color_2.img}`}
                                  ></img>
                                ) : (
                                  <img
                                    className="w-10 drop-shadow-lg"
                                    src={`${
                                      colors.find(
                                        (color) => color_2.value === color.name
                                      )?.img
                                    }`}
                                  ></img>
                                )}
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
        {selectedStyle.value !== "none" ? (
          <div className="flex-grow">
            <p className="italic text-sm">Estilo</p>
            <Listbox value={selectedStyle} onChange={setSelectedStyle}>
              <div className="relative mt-1 flex-auto">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate">{selectedStyle.value}</span>
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
                    {productOptions().style_options.map((style, i) => (
                      <Listbox.Option
                        key={i}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-amber-100 text-amber-900"
                              : "text-gray-900"
                          }`
                        }
                        value={style}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              <div className="flex justify-between mr-2">
                                <span>{style.value}</span>
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
        ) : null}
        {selectedModel.value !== "none" ? (
          <div className="flex-grow">
            <p className="italic text-sm">Modelo</p>
            <Listbox value={selectedModel} onChange={setSelectedModel}>
              <div className="relative mt-1 flex-auto">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate">{selectedModel.value}</span>
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
                    {productOptions().model_options.map((model, i) => (
                      <Listbox.Option
                        key={i}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-amber-100 text-amber-900"
                              : "text-gray-900"
                          }`
                        }
                        value={model}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              <div className="flex justify-between mr-2">
                                <span>{model.value}</span>
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
        ) : null}
      </div>
    );
  }

  function imageContainer() {
    return (
      <>
        <img
          id="productImage"
          key={imageIndex}
          className="z-30 max-h-[70vh] object-cover transition-all duration-200 object-center rounded-sm drop-shadow-[5px_5px_5px_rgba(0,0,0,0.10)]"
          src={`${product.img[imageIndex]}`}
          style={{ opacity: "0" }} // Set initial opacity to 0
          onLoad={(e) => {
            const img = e.target as HTMLImageElement; // Use type assertion to cast to HTMLImageElement
            e.preventDefault();
            img.style.opacity = "1"; // Set opacity to 1 after image is loaded
          }}
        ></img>

        {product.img.length > 1 && (
          <div
            onClick={() => {
              product.img.length - 1 === imageIndex
                ? setImageIndex(0)
                : setImageIndex(imageIndex + 1);
            }}
            className="heartbeat absolute transition-all duration-150 p-6 cursor-pointer active:scale-95 hover:scale-105 group-hover:opacity-100 opacity-30 rounded hover:bg-neutral-900 bg-neutral-900/70 text-white top-[45%] sm:right-5 right-2 "
          >
            {">"}
          </div>
        )}
        {product.img.length > 1 && (
          <div
            onClick={() => {
              imageIndex === 0
                ? setImageIndex(product.img.length - 1)
                : setImageIndex(imageIndex - 1);
            }}
            className="heartbeat absolute transition-all duration-150 cursor-pointer p-6 active:scale-95 hover:scale-105 group-hover:opacity-100 opacity-30 rounded hover:bg-neutral-900 bg-neutral-900/70 text-white top-[45%] sm:left-5 left-2"
          >
            {"<"}
          </div>
        )}
      </>
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
          content={`https://www.klass.tienda/${product.img}`}
        />
        <meta property="product:brand" content="Klass" />
      </Head>

      <section className="py-12 flex justify-center xl:w-[80%] mx-auto items-center   p-5  xl:flex-row flex-col  gap-5 ">
        <div className="relative aspect-[4/5]  xl:mx-0 mx-auto  group text-xl ">
          {imageContainer()}
        </div>
        <div className="h-full min-w-[40vw] lg:max-w-[40vw] z-50">
          <div className=" flex flex-col gap-5   mr-0 shadow-lg p-5 lg:p-10">
            <h1 className="font-bold text-3xl lg:text-3xl ">{product.name}</h1>

            <h2
              key={totalPrice()}
              className="text-2xl text-lime-700 font-bold tilt-in-fwd-tr"
            >
              {product.base_price === 1
                ? "Presupuestar"
                : formatter.format(totalPrice())}
            </h2>

            <p className="text-md whitespace-pre-wrap leading-5 ">
              {product.description}
            </p>

            {listboxOptions()}

            {product.base_price !== 1 && (
              <button
                className="bg-green-600 p-3 font-semibold rounded-sm w-[100%]  self-center  text-white active:scale-95 transition-all duration-150 hover:drop-shadow-md hover:bg-green-500 "
                onClick={() => {
                  addToCart(
                    product._id,
                    totalPrice(),
                    selectedSize.value,
                    selectedColor_1.value,
                    selectedColor_2.value,
                    selectedStyle.value,
                    selectedModel.value
                  );
                }}
              >
                Agregar al carrito
              </button>
            )}
          </div>
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
