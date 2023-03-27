import React, { useEffect, useState, Fragment } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import clientPromise from "../../../mongodb";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import { useRouter } from "next/router";
import { FileOpen } from "@mui/icons-material";

export default function Orders({ items, totalDocuments }) {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const [selected, setSelected] = useState(items[0]);

  const [page, setPage] = useState(1);
  let [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    router.push(`/adminpanel/custom_orders/${page}`);
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
              ? "p-1 px-3 cursor-pointer bg-primary scale-110 rounded-sm text-white transition-all duration-150"
              : "p-1 px-3 cursor-pointer hover:bg-primary rounded-sm  hover:text-white transition-all duration-150"
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
    const res = await fetch("https://www.klass.com/api/custom_orders", {
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
                <div className="bg-amber-400  rounded-sm font-bold text-white px-3 py-1">
                  Pendiente
                </div>
              ) : order.state === "confirmed" ? (
                <div className="bg-green-400 rounded-sm font-bold text-white px-3 py-1">
                  Confirmado
                </div>
              ) : order.state === "sent" ? (
                <div className="bg-green-700 rounded-sm font-bold text-white px-3 py-1">
                  Enviado
                </div>
              ) : null}
            </Listbox.Button>
            <Listbox.Options>
              <div className="absolute w-40 bg-white z-50 shadow-lg p-2  rounded-sm mt-2 -translate-x-[50%] inset-x-[50%]">
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
          <div className="2xl:w-[60%] min-h-[60vh] bg-white lg:w-[80%] mx-auto p-5 my-10 border bg-neutral-100 rounded-sm shadow-md">
            <h1 className="text-3xl font-semibold mb-5">
              Estos son todos los pedidos:{" "}
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
                      className="z-0 flex xl:flex-row flex-col gap-3 items-center justify-between bg-white border px-4 py-2 rounded-sm hover:shadow-md
                      hover:bg-emerald-100
                      transition-all duration-150"
                    >
                      <div className="flex gap-4">
                        <div className="font-semibold  text-gray-500 break-words  break-all ">
                          Código: {item._id}
                        </div>

                        <span className="font-semibold ">
                          Cliente: {item.clientName}
                        </span>
                      </div>
                      <div
                        onClick={() => openModal()}
                        className="text-sm cursor-pointer px-4 justify-self-end"
                      >
                        <FileOpen className="text-gray-500  hover:text-gray-700 transition-all duration-200"></FileOpen>
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

                <div className="fixed inset-0">
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
                      <Dialog.Panel className=" transform rounded-sm bg-white p-6 text-left align-middle shadow-xl transition-all w-[50vw]">
                        <Dialog.Title
                          as="h3"
                          className="text-xl font-medium leading-6 text-black"
                        >
                          <div className="flex justify-between flex-col">
                            <div>
                              <span>Detalles del pedido</span>
                            </div>
                            <div className="text-gray-700 text-sm">
                              <div className="a border-b py-2">
                                <span className="font-bold">
                                  Datos de contacto
                                </span>
                                <p>{selected?.clientName}</p>
                                <p> {selected?.clientEmail}</p>
                                <p> {selected?.clientNumber}</p>
                                <p> {selected?.clientAddress}</p>
                              </div>
                              <div className="pt-2">
                                <span className="font-bold">Descripción</span>
                                <p className="my-1">{selected?.message}</p>
                                <div className="flex flex-wrap gap-3 max-h-96 overflow-y-auto">
                                  {selected?.images.map((img, idx) => {
                                    return (
                                      <a
                                        key={idx}
                                        target="_blank"
                                        rel="noreferrer"
                                        href={`${img}`}
                                      >
                                        {" "}
                                        <img
                                          className="w-52"
                                          src={`${img}`}
                                        ></img>
                                      </a>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Dialog.Title>
                        <div className="my-3 text-[.95rem] flex flex-col"></div>
                        <div className="mt-4 self-end">
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
  const collection = db.collection("custom_orders");
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
