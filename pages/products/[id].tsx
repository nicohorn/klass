import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  Fragment,
} from "react";
import { useRouter } from "next/router";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

import { useProducts } from "../layout/navbar";
var ObjectId = require("mongodb").ObjectId;
import clientPromise from "../../mongodb";
import { type } from "os";

export default function Id({ item }) {
  const addToCart = useProducts((state: any) => state.addToCart);
  let productsCart = useProducts((state: any) => state.cart);

  const setCart = useProducts((state: any) => state.setCart);

  const router = useRouter();
  const product = item[0];

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

  let productPrice =
    typeof product.price == "number"
      ? product.price
      : typeof product.price[0] == "object"
      ? product.price[0].price
      : product.price[0];

  const people = [
    { id: 1, name: "Durward Reynolds", unavailable: false },
    { id: 2, name: "Kenton Towne", unavailable: false },
    { id: 3, name: "Therese Wunsch", unavailable: false },
    { id: 4, name: "Benedict Kessler", unavailable: true },
    { id: 5, name: "Katelyn Rohan", unavailable: false },
  ];

  console.log(item[0].price, item[0].name);

  //Este useState contiene una de las opciones que fue seleccionada de precio del producto (en caso de tener opciones de precio).
  const [selected, setSelected] = useState(item[0].price[0]);

  function productOptionsListBox() {
    return (
      <div>
        <Listbox value={selected} onChange={setSelected}>
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
              <span className="block truncate">{selected.size}</span>
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
              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {item[0].price.map((price, i) => (
                  <Listbox.Option
                    key={i}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                      }`
                    }
                    value={price}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          <div className="flex justify-between mr-2">
                            <span>{price.size}</span>
                            <span className="text-gray-500 italic">
                              {formatter.format(price.price)}
                            </span>
                          </div>
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
    );
  }

  let priceSize = () => {
    //This is a helper function to return the price and the option selected when it's available. If it's not, it will return an option (called size because that's how it's defined on the db) with a value of null.
    let price, size;
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
    <section className="flex justify-center m-4 mt-8 flex-grow lg:flex-row flex-col lg:px-0 sm:px-32  gap-5 lg:gap-0 ">
      <div className="w-full xl:w-[40%]">
        <div className=" flex flex-col gap-5 lg:mr-10 mr-0 shadow-lg p-5 lg:p-10">
          <h1 className="font-bold text-3xl lg:text-5xl">{product.name}</h1>
          <h2 className="text-2xl text-lime-700 font-bold">
            {typeof product.price == "number"
              ? formatter.format(product.price)
              : typeof product.price[0] == "object"
              ? formatter.format(selected.price)
              : product.price[0]}
          </h2>
          <p className="text-md whitespace-pre-wrap text-[.93rem]">
            {product.description}
          </p>
          <div className="text-sm text-gray-600 italic ">{product.tags}</div>
          <div>
            {typeof product.price == "object" ? productOptionsListBox() : null}
          </div>
          <button
            className="bg-green-500 p-3 rounded-lg w-[100%]  self-center hover:bg-green-700 text-white active:scale-95 transition-all duration-150 hover:drop-shadow-[3px_3px_1px_rgba(0,0,0,0.25)]"
            onClick={() => {
              addToCart(product._id, priceSize().price, priceSize().size);
            }}
          >
            Agregar al carrito
          </button>
        </div>
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
  // const res = await fetch(
  //   `http://localhost:3000/api/products/${context.params.id}`
  // );
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
