import React, { useEffect, useState, Fragment } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import clientPromise from "../../mongodb";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import { useRouter } from "next/router";
import { FileOpen } from "@mui/icons-material";
import { ProductJsonLd } from "next-seo";

export default function Orders({ items, totalDocuments }) {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const [selected, setSelected] = useState(items[0]);

  const [page, setPage] = useState(1);
  /**Formats price field (number type in js, double in mongodb) to a US currency format. */
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

  let [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    router.push(`/adminpanel/${page}`);
  }, [page]);

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  const [orderState, setOrderState] = useState(0);

  /**Generates numeration of pages in divs according to the max number of documents in the db */
  function pagination() {
    let buttons = [];
    for (let i = 0; i < Math.ceil(totalDocuments / 8); i++) {
      buttons.push(
        <div
          key={i + 1}
          onClick={() => setPage(i + 1)}
          className={
            i + 1 == page
              ? "p-2 px-4 cursor-pointer bg-neutral-600 scale-110 rounded-md text-white transition-all duration-150"
              : "p-2 px-4 cursor-pointer hover:bg-neutral-600 rounded-md  hover:text-white transition-all duration-150"
          }
        >
          {i + 1}
        </div>
      );
    }

    return (
      <div className="flex justify-center gap-2 my-5">
        {buttons.map((button) => {
          return button;
        })}
      </div>
    );
  }

  const updateOrder = async (orderToBeUpdated) => {
    const res = await fetch("https://www.klass.com/api/orders", {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderToBeUpdated),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        console.log("Se actualizó la siguiente orden: ", json);
      });
  };

  const states = [
    { name: "Pendiente", state: "pending" },
    { name: "Confirmado", state: "confirmed" },
    { name: "Enviado", state: "sent" },
  ];

  function selectState(order) {
    return (
      <div className="flex-grow">
        <Listbox>
          <div className="relative">
            <Listbox.Button>
              {order.state === "pending" ? (
                <div className="bg-amber-400  rounded-lg font-bold text-white px-3 py-1">
                  Pendiente
                </div>
              ) : order.state === "confirmed" ? (
                <div className="bg-green-400 rounded-lg font-bold text-white px-3 py-1">
                  Confirmado
                </div>
              ) : order.state === "sent" ? (
                <div className="bg-green-700 rounded-lg font-bold text-white px-3 py-1">
                  Enviado
                </div>
              ) : null}
            </Listbox.Button>
            <Listbox.Options>
              <div className="absolute w-40 bg-white z-50 shadow-lg p-2  rounded-lg mt-2 -translate-x-[50%] inset-x-[50%]">
                {states.map((state, stateIdx) => (
                  <span key={stateIdx} className="flex flex-col ">
                    <Listbox.Option
                      className="py-1 hover:bg-gray-200 cursor-pointer"
                      key={stateIdx}
                      value={state.state}
                      onClick={() => {
                        const docToBeUpdated = {
                          _id: order._id,
                          state: state.state,
                        };
                        order.state = state.state;
                        updateOrder(docToBeUpdated);
                        setOrderState(orderState + 1);
                      }}
                    >
                      <span
                        className={
                          state.state == order.state
                            ? "font-bold"
                            : "font-normal hover:font-semibold"
                        }
                      >
                        {state.name}
                      </span>
                    </Listbox.Option>
                  </span>
                ))}
              </div>
            </Listbox.Options>
          </div>
        </Listbox>
      </div>
    );
  }

  if (isLoading) {
    return null;
  }

  return (
    <main className="flex-grow ">
      {user.sub == "google-oauth2|102747183325371068763" ||
      user.sub == "google-oauth2|101977740947109023372" ? (
        <div>
          <div className="2xl:w-[60%] lg:w-[80%] mx-auto p-5 my-10 border bg-neutral-100 rounded-md shadow-md">
            <h1 className="text-3xl font-semibold mb-5">
              Estos son todos pedidos:{" "}
            </h1>

            <div className="flex flex-col gap-3 mt-2 mb-2 z-0">
              {items.map((item, i) => {
                return (
                  <button
                    className="cursor-default"
                    key={i}
                    onClick={() => {
                      setSelected(item);
                    }}
                  >
                    <div
                      key={i}
                      className="z-0 flex xl:flex-row flex-col gap-3 items-center justify-between bg-white border px-4 py-2 rounded-md hover:shadow-md
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
                      {selectState(item)}
                      <div className="py-2 flex gap-3 items-center md:w-[25%] ">
                        <span className="text-sm font-semibold text-green-600 basis-4/5">
                          Total: {formatter.format(item.total)}
                        </span>
                        <div
                          onClick={() => openModal()}
                          className="text-sm cursor-pointer px-4"
                        >
                          <FileOpen className="text-gray-500 hover:text-gray-700 transition-all duration-200"></FileOpen>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div>{pagination()}</div>
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
                              <span>Detalles del pedido</span>
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
                                <h2 className="bg-amber-400 text-white text-sm px-2 rounded-lg">
                                  Pendiente
                                </h2>
                              ) : selected?.state == "confirmed" ? (
                                <h2 className="bg-green-500 text-white text-sm px-2 rounded-lg">
                                  Confirmado
                                </h2>
                              ) : selected?.state == "sent" ? (
                                <h2 className="bg-green-700 text-white text-sm px-2 rounded-lg">
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
                                className="flex gap-5 justify-between border-b border-gray-200"
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
                            Total: {formatter.format(selected?.total)}
                          </span>
                          <div className="flex flex-col gap-2">
                            <span className="text-gray-500 font-semibold border-b border-gray-200">
                              Información de contacto
                            </span>
                            <div className="flex flex-col">
                              <span className="text-xs">
                                Nombre del cliente
                              </span>
                              <span className="font-semibold">
                                {selected.clientName}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs">Email</span>
                              <span className="font-semibold">
                                {selected.clientEmail}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 self-end">
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
        </div>
      ) : (
        <div>Acceso denegado</div>
      )}
    </main>
  );
}

export async function getServerSideProps(context) {
  const client = await clientPromise;
  const db = client.db("klass_ecommerce");
  const collection = db.collection("orders");
  let currentPage = parseInt(context.query.n);
  const ordersPerPage = 8;

  const [totalDocuments, ordersResponse] = await Promise.all([
    await collection.countDocuments(),
    await collection
      .find({})
      .skip((currentPage - 1) * ordersPerPage)
      .limit(ordersPerPage)
      .toArray(),
  ]);

  return {
    props: {
      items: ordersResponse.map((item) => {
        return {
          ...item,
          _id: item._id.toString(),
        };
      }),
      totalDocuments: totalDocuments,
    },
  };
}
