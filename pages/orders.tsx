import React, { useEffect, useState, Fragment } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import clientPromise from "../mongodb";
import { formatter } from "utils";
import { Dialog, Transition } from "@headlessui/react";
import { getSession } from "@auth0/nextjs-auth0";

export default function Orders({ items }) {
  const { user, error, isLoading } = useUser();
  const [selected, setSelected] = useState(items[0]);

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

    return (
      <main className="w-full ">
        <div className="2xl:w-[60%] min-h-[60vh] md:w-[80%] mx-auto p-5 my-10 border bg-white rounded-sm shadow-md">
          <h1 className="text-3xl font-semibold">Hola {user.name}! </h1>
          <p className="p-2">Estos son tus pedidos:</p>

          <div className="flex flex-col gap-3 mt-2 mb-2 ">
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
                    className=" flex xl:flex-row flex-col gap-3 items-center justify-between bg-white border px-4 py-2 rounded-sm hover:shadow-md
                      hover:bg-emerald-100
                      transition-all duration-150"
                  >
                    <div className="font-semibold flex gap-4 xl:w-[30%] text-gray-500 break-words  break-all ">
                      Código: {item._id}
                    </div>

                    <span className="font-semibold ">
                      Productos:{" "}
                      {item.products
                        .map((product) => {
                          return product.count;
                        })
                        .reduce((acc, num) => {
                          return acc + num;
                        })}
                    </span>
                    <div className="flex gap-2 flex-grow">
                      {item.products.slice(0, 5).map((product, i) => {
                        return (
                          <div key={i}>
                            <img
                              className="rounded-full aspect-square object-cover mx-2  object-center w-10 h-10"
                              src={product.img[0]}
                              title={`${product.name} `}
                            ></img>
                          </div>
                        );
                      })}
                    </div>

                    <div className="py-2 flex gap-3 items-center md:w-[25%] ">
                      {item.state == "pending" ? (
                        <h2 className="bg-amber-400 text-white text-sm px-2 rounded-md">
                          Pendiente
                        </h2>
                      ) : item.state == "confirmed" ? (
                        <h2 className="bg-green-500 text-white text-sm px-2 rounded-md">
                          Confirmado
                        </h2>
                      ) : item.state == "sent" ? (
                        <h2 className="bg-green-700 text-white text-sm px-2 rounded-md flex gap-2 items-center">
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
                      <span className="text-sm font-semibold text-[#228d39] basis-4/5">
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
                    <Dialog.Panel className=" transform rounded-sm bg-white p-6 text-left align-middle shadow-xl transition-all">
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
                                selected?.createdAt
                              ).toLocaleDateString()}{" "}
                              a las{" "}
                              {new Date(
                                selected?.createdAt
                              ).toLocaleTimeString()}
                            </p>
                          </div>
                          <div>
                            {selected?.state == "pending" ? (
                              <h2 className="bg-amber-400 text-white text-sm px-2 rounded-md">
                                Pendiente
                              </h2>
                            ) : selected?.state == "confirmed" ? (
                              <h2 className="bg-green-500 text-white text-sm px-2 rounded-md">
                                Confirmado
                              </h2>
                            ) : selected?.state == "sent" ? (
                              <h2 className="bg-green-700 text-white text-sm px-2 rounded-md">
                                Enviado
                              </h2>
                            ) : null}
                          </div>
                        </div>
                      </Dialog.Title>
                      <div className="my-3 text-[.95rem] flex flex-col">
                        {selected?.products.map((product, i) => {
                          return (
                            <div
                              key={i}
                              className="flex flex-col gap-1 mb-2 justify-between border-b border-gray-200"
                            >
                              <span className="font-semibold hover:text-gray-500 text-gray-800 transition-all duration-100">
                                -
                                <a
                                  key={i}
                                  rel="noreferrer"
                                  target="_blank"
                                  href={`/products/${product.id}`}
                                >
                                  {product.name}
                                </a>{" "}
                                x {product.count}
                              </span>{" "}
                              <span className="flex flex-col">
                                {product.size !== "none" &&
                                typeof product.size !== "undefined" ? (
                                  <span className="text-gray-600">
                                    Tamaño:{" "}
                                    <span className="italic">
                                      {product.size}
                                    </span>
                                  </span>
                                ) : null}
                                {product.color_1 !== "none" &&
                                typeof product.color_1 !== "undefined" ? (
                                  <span className="text-gray-600">
                                    Color 1:{" "}
                                    <span className="italic">
                                      {product.color_1}
                                    </span>
                                  </span>
                                ) : null}
                                {product.color_2 !== "none" &&
                                typeof product.color_2 !== "undefined" ? (
                                  <span className="text-gray-600">
                                    Color 2:{" "}
                                    <span className="italic">
                                      {product.color_2}
                                    </span>
                                  </span>
                                ) : null}
                                {product.style !== "none" &&
                                typeof product.style !== "undefined" ? (
                                  <span className="text-gray-600">
                                    Estilo:{" "}
                                    <span className="italic">
                                      {product.style}
                                    </span>
                                  </span>
                                ) : null}
                                {product.model !== "none" &&
                                typeof product.model !== "undefined" ? (
                                  <span className="text-gray-600">
                                    Modelo:{" "}
                                    <span className="italic">
                                      {product.model}
                                    </span>
                                  </span>
                                ) : null}
                              </span>
                              <span className="self-end">
                                {formatter.format(product.price)}
                              </span>
                            </div>
                          );
                        })}
                        <span className="text-[#228d39] font-semibold self-end mt-4">
                          Total: {formatter.format(selected?.total)}
                        </span>
                      </div>

                      <div className="mt-4">
                        <button
                          type="button"
                          className="inline-flex justify-center border hover:border-red-800 border-red-400 border-transparent  text-red-400 bg-white px-4 py-1 text-sm font-medium hover:text-white hover:bg-red-800 transition-all duration-200 focus:outline-none"
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
  } catch (error) {
    throw Error(error);
  }
}

export async function getServerSideProps({ req, res }) {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library

  async function handler() {
    const client = await clientPromise;
    const db = client.db("klass_ecommerce");
    const collection = db.collection("orders");
    const collection2 = db.collection("custom_orders");

    const session = getSession(req, res);
    const at = session.accessToken;
    const userInfo = await fetch(
      "https://dev-5iz0oclpqjwsu4v1.us.auth0.com/userinfo",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${at}`,
        },
      }
    ).then((response) => {
      return response.json();
    });

    const [items, custom_orders] = await Promise.all([
      await collection.find({ userId: userInfo.sub }).toArray(),
      await collection2.find({ userId: userInfo.sub }).toArray(),
    ]);

    return items;
  }

  const response = await handler();

  // By returning { props: { items } }, the Products component
  // will receive `items` as a prop at build time
  return {
    props: {
      items: response.map((item) => {
        return {
          ...item,
          _id: item._id.toString(),
        };
      }),
    },
  };
}
