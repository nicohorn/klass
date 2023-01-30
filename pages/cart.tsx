import React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useProducts } from "../zustand";
import clientPromise from "@clientPromise";
import { Disclosure, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0";
import gsap from "gsap";
import { ToastContainer, toast } from "react-toastify";

type Order = {
  userId: string;
  clientName: string;
  clientEmail: string;
  products: object[];
  total: number;
  createdAt: string;
  state: string;
};

export default function Cart({ items }) {
  const productsCart = useProducts((state: any) => state.cart);
  const setCart = useProducts((state: any) => state.setCart);
  const removeFromCart = useProducts((state: any) => state.removeFromCart);
  const deleteCart = useProducts((state: any) => state.deleteCart);
  const { user, error, isLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const formatter = new Intl.NumberFormat("en-US", {
    //To give the price field (number type in js, double in mongodb) a US currency format.
    style: "currency",
    currency: "USD",
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

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

    gsap.fromTo("#loading-icon", { rotate: 0 }, { rotate: 180, repeat: -1 });
  });

  if (isLoading) {
    //This if is to wait for the user data retrieved by auth0 useUser hook.
    return null;
  }

  const filteredProducts = () => {
    //Function to "join" the products retrieved from the db and the products in cart (which only have id and count properties, while the products form the database have all the rest of the info)
    return productsCart.map((product) => {
      return { ...items.find((item) => item._id === product.id), ...product };
    });
  };

  let transformedProducts = filteredProducts();

  const totalCartPrice = () => {
    //Gets the corresponding individual price (meaning that if the product has an option selected, it will get the price for that option) of each product in cart and then sums them all up to get the total price of the cart using the reduce function.
    let sum = 0;
    for (let i = 0; i < transformedProducts.length; i++) {
      if (typeof transformedProducts[i].price == "number") {
        sum += transformedProducts[i].price * transformedProducts[i].count;
      }
    }

    return sum;
  };

  const getTotalCount = () => {
    //Gets the count of each product in cart and then sums them all up to get the total count using the reduce function.
    let counts = productsCart.map((product) => {
      return product.count;
    });

    let sum = counts.reduce((acc, num) => {
      return acc + num;
    }, 0);

    return sum;
  };

  const createOrder = async (order: Order) => {
    //Once the client is in the cart page, he can delete some products from the cart if needed or wanted, and then he can chose to complete an order, which posts a new order document to mongodb. This is the function that does it.
    setLoading(true);

    const res = await fetch("/api/orders", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    })
      .then((response) => {
        setLoading(false);

        return response.json();
      })
      .then((json) => {
        router.push(`/orders`);
        console.log("El pedido es el siguiente: ", json);
      });

    console.log("delete cart");
    deleteCart();
    localStorage.clear();
  };

  /** Toast */
  const notify = () =>
    toast.success(
      <p className="">
        <b>Genial! Ya recibimos tu pedido. </b>
        <br />
        En las próximas horas nos estaremos contactando a tu <b>email</b> para
        coordinar el <i>pago y el envío.</i>
      </p>,
      {
        autoClose: 8000,
      }
    );

  return (
    <main className="mx-auto  sm:my-10   sm:px-2 flex-grow w-full sm:w-auto">
      <div className="md:w-[40rem] p-5 border bg-neutral-100 rounded-md shadow-md">
        <div className="pb-4 text-2xl font-bold justify-between flex items-center">
          <div>Mi carrito</div>
          <div>
            {" "}
            <div
              id="cart-icon"
              className="text-white cursor-pointer  flex items-center"
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
            </div>
          </div>
        </div>
        {getTotalCount() != 0 ? (
          <>
            {transformedProducts.map((product, i) => {
              let categories = product.categories.toString().split("/");
              return (
                <Disclosure key={i}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className=" rounded-md flex  w-full hover:shadow-md items-center justify-between bg-white px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-emerald-100 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75 border transition-all duration-150 mb-4">
                        <div
                          key={i}
                          className=" flex grow flex-col sm:flex-row gap-5 justify-between items-center"
                        >
                          <div className="flex gap-2 grow items-center">
                            <div className="font-bold lg:text-lg">
                              {product.name}
                            </div>
                            {product.option ? product.option : null}
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
                              : typeof product.price[0] == "string"
                              ? product.price[0]
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
                        enter="transition duration-100 ease-in"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-150 ease-out"
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
                              removeFromCart(product._id, product.option);
                              localStorage.setItem(
                                "my-cart",
                                JSON.stringify("")
                              );
                            }}
                            className="hover:bg-red-500 transition-all duration-150 self-end p-2 mt-4 text-white font-semibold rounded-sm bg-red-700"
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
            <div className="flex flex-col">
              <div className="flex justify-end text-lg mr-2 mt-5 font-bold text-green-500">
                <span className="mr-3">Total:</span>
                <span>{formatter.format(totalCartPrice())}</span>
              </div>

              <div className=" bg-green-600 p-1 px-3 cursor-pointer mt-3 mr-2 self-end text-center text-white rounded-sm hover:shadow-md transition-all duration-150 w-44 flex justify-center">
                <button
                  className="font-semibold"
                  onClick={() => {
                    if (user) {
                      createOrder({
                        userId: user?.sub,
                        clientName: user?.name,
                        clientEmail: user?.email,
                        products: transformedProducts,
                        total: totalCartPrice(),
                        createdAt: new Date().toISOString(),
                        state: "pending",
                      });
                      setTimeout(() => {
                        notify();
                      }, 1000);
                    } else {
                      router.push("/api/auth/login?returnTo=/cart");
                    }
                  }}
                >
                  {loading ? (
                    <svg
                      id="loading-icon"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.2}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                      />
                    </svg>
                  ) : user ? (
                    "Completar pedido"
                  ) : (
                    <span>
                      Completar pedido
                      <h3 className="text-xs">Iniciar sesión</h3>
                    </span>
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">
            <p>El carrito está vacío</p>
            <Link href={"/products"}>
              <div className="bg-green-600 font-semibold p-1 px-3 cursor-pointer my-6 inline-block text-white rounded-sm hover:drop-shadow-xl transition-all duration-150">
                Ver productos
              </div>
            </Link>
          </div>
        )}
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
