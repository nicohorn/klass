import React, { useEffect, useState, Fragment } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import clientPromise from "../mongodb";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";

export default function Profile({ items }) {
  const { user, error, isLoading } = useUser();
  const [selected, setSelected] = useState(items[0]);
  const formatter = new Intl.NumberFormat("en-US", {
    //To give the price field (number type in js, double in mongodb) a US currency format.
    style: "currency",
    currency: "USD",
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

  let [isOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  if (isLoading) {
    return null;
  }

  try {
    //This try catch is to ensure that the logged user can only see his orders and not the orders of other users.
    if (items[0]?.userId == user?.sub) {
      return (
        <main className="flex-grow ">
          <div className="md:w-[50%] mx-auto p-5 my-10 border bg-neutral-100 rounded-md shadow-md">
            <h1 className="text-3xl font-semibold">Hola {user.name}! </h1>
            <p className="p-2">Estos son tus pedidos:</p>
            <div className="flex flex-col gap-3 mt-2 mb-2">
              {items.map((item, i) => {
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setSelected(item);
                      openModal();
                    }}
                  >
                    <div
                      key={i}
                      className="flex flex-wrap  justify-between items-center bg-white border px-4 py-2 rounded-md hover:shadow-md
                      hover:bg-emerald-100
                      transition-all duration-150"
                    >
                      <div className="font-semibold flex-wrap flex gap-4 items-center">
                        <span className="text-gray-500">
                          Código: {item._id}
                        </span>
                        <span>
                          Productos:{" "}
                          {item.products
                            .map((product) => {
                              return product.count;
                            })
                            .reduce((acc, num) => {
                              return acc + num;
                            })}
                        </span>
                        <span className="flex gap-2 flex-wrap ">
                          {item.products.map((product) => {
                            return (
                              <img
                                className="rounded-full aspect-square object-cover object-center w-10 h-10"
                                src={product.img}
                                title={`${product.name} ${
                                  product.option ? product.option : ""
                                } x ${product.count}`}
                              ></img>
                            );
                          })}
                        </span>
                      </div>

                      <div className="py-2 flex gap-3 items-center flex-wrap ">
                        {item.state == "pending" ? (
                          <h2 className="bg-amber-400 text-white text-sm px-2 rounded-lg">
                            Pendiente
                          </h2>
                        ) : item.state == "confirmed" ? (
                          <h2 className="bg-green-500 text-white text-sm px-2 rounded-lg">
                            Confirmado
                          </h2>
                        ) : item.state == "sent" ? (
                          <h2 className="bg-green-700 text-white text-sm px-2 rounded-lg flex gap-2 items-center">
                            Enviado{" "}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </h2>
                        ) : null}
                        <span className="text-sm font-semibold text-green-600">
                          Total: {formatter.format(item.total)}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <>
            <Transition appear show={isOpen} as={Fragment}>
              <Dialog as="div" onClose={closeModal}>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-hidden">
                  <div className="flex min-h-full items-center justify-center text-center">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <Dialog.Panel className=" transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <Dialog.Title
                          as="h3"
                          className="text-xl font-medium leading-6 text-black"
                        >
                          <div className="flex justify-between items-baseline">
                            <div>
                              <span>Detalles de tu pedido</span>
                              <p className="text-sm mt-1 text-gray-500">
                                Realizado el:{" "}
                                {new Date(
                                  selected.createdAt
                                ).toLocaleDateString()}{" "}
                                a las{" "}
                                {new Date(
                                  selected.createdAt
                                ).toLocaleTimeString()}
                              </p>
                            </div>
                            <div>
                              {selected.state == "pending" ? (
                                <h2 className="bg-amber-400 text-white text-sm px-2 rounded-lg">
                                  Pendiente
                                </h2>
                              ) : selected.state == "confirmed" ? (
                                <h2 className="bg-green-500 text-white text-sm px-2 rounded-lg">
                                  Confirmado
                                </h2>
                              ) : selected.state == "sent" ? (
                                <h2 className="bg-green-700 text-white text-sm px-2 rounded-lg">
                                  Enviado
                                </h2>
                              ) : null}
                            </div>
                          </div>
                        </Dialog.Title>
                        <div className="my-3 text-[.95rem] flex flex-col">
                          {selected.products.map((product, i) => {
                            return (
                              <div
                                key={i}
                                className="flex gap-5 justify-between"
                              >
                                <span className="font-semibold hover:text-gray-500 text-gray-800 transition-all duration-100">
                                  -
                                  <Link href={`/products/${product.id}`}>
                                    {product.name}
                                  </Link>{" "}
                                  x {product.count}
                                </span>{" "}
                                {product.option ? (
                                  <span className="text-gray-600">
                                    Opción:{" "}
                                    <span className="italic">
                                      {product.option}
                                    </span>
                                  </span>
                                ) : null}
                                <span>{formatter.format(product.price)}</span>
                              </div>
                            );
                          })}
                          <span className="text-green-600 font-semibold self-end mt-4">
                            Total: {formatter.format(selected.total)}
                          </span>
                        </div>

                        <div className="mt-4">
                          <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-teal-500 px-4 py-2 text-sm font-medium text-white hover:bg-teal-300 focus:outline-none"
                            onClick={closeModal}
                          >
                            Cerrar
                          </button>
                        </div>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition>
          </>
        </main>
      );
    } else {
      throw "You can't access other users orders";
    }
  } catch (error) {
    console.log(error);
    return (
      <main className="flex-grow">
        <div className="w-[50%] mx-auto p-5 mt-10 border">
          <h1 className="text-3xl font-semibold">Acceso denegado </h1>
        </div>
      </main>
    );
  }
}

export async function getServerSideProps(context) {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library

  async function handler() {
    const client = await clientPromise;
    const db = client.db("klass_ecommerce");
    const collection = db.collection("orders");

    return await collection.find({ userId: context.query.id }).toArray();
  }

  const res = await handler();
  console.log("userId id", context.query.id);

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
