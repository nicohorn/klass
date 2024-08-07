import { ProductType, PromotionType } from "src/utils/types"
import clientPromise from "../../mongodb";
import React, { useMemo } from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useProducts } from "../utils/zustand";
import { Disclosure, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0/client";
import { toast } from "react-toastify";
import { formatter } from "src/utils/utils";
import { CartItemType } from "src/utils/types";
import { productPrice } from "src/utils/productPrice";

type CartProps = {
  items: ProductType[],
  promotions: PromotionType[]
}
export default function Cart({ items, promotions }: CartProps) {
  const productsCart = useProducts((state: any) => state.cart as CartItemType[]);
  const setCart = useProducts((state: any) => state.setCart);
  const removeFromCart = useProducts((state: any) => state.removeFromCart);
  const deleteCart = useProducts((state: any) => state.deleteCart);
  const { user, isLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const localStorageCart = JSON.parse(localStorage.getItem("my-cart") ?? '[]');
    setCart(localStorageCart);
  }, [])

  const transformedProducts = useMemo(() => {
    return productsCart.map(cartItem => {
      const product = items.find(p => p._id === cartItem.id);
      return {
        ...cartItem,
        _id: product._id,
        name: product.name,
        img: product.img,
        price: productPrice(product, cartItem)
      }
    })
  }, [productsCart, items])

  const totalCartPrice = transformedProducts.reduce(
    (sum, p) => sum + p.price * p.count, 0
  )

  const totalCount = transformedProducts.reduce(
    (sum, p) => sum + p.count, 0
  )

  if (isLoading) {
    return null
  }

  const createOrder = async () => {
    if (!user) {
      return router.push("/api/auth/login?returnTo=/cart")
    }
    try {
      setLoading(true);

      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.sub,
          clientName: user?.name,
          clientEmail: user?.email,
          products: transformedProducts,
        })
      })

      deleteCart();
      localStorage.clear();

      setTimeout(() => {
        notify();
        router.push(`/orders`);
      }, 1000);
    } finally {
      setLoading(false);
    }
  }

  const notify = () =>
    toast.success(
      <p className="">
        <b>¡Gracias por usar nuestra versión BETA!</b>
        <br />
        en breve vas a recibir un <b>email</b> para coordinar el <i>pago </i> y
        demás detalles.
      </p>,
      {
        autoClose: 8000,
      }
    );

  return (
    <main className="mx-auto  sm:my-10   sm:px-2 flex-grow w-full sm:w-auto h-screen">
      <div className="md:w-[40rem] mx-auto p-5 border bg-white shadow-md drop-shadow-[1px_1px_3px_rgba(0,0,0,0.90)]">
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
        {totalCount != 0 ? (
          <>
            {transformedProducts.map((product, i) => {
              return (
                <Disclosure key={i}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className=" flex  w-full hover:shadow-md items-center justify-between bg-white px-4 py-2 text-left text-sm font-medium text-black hover:bg-emerald-100 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75 border transition-all duration-150 mb-4">
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
                              : typeof product.price[0] == "string"
                                ? product.price[0]
                                : product.price[0] * product.count}
                          </div>
                        </div>

                        <ChevronUpIcon
                          className={`${open ? "" : "rotate-180 transform"
                            } h-5 w-5 text-yellow-500`}
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
                              {formatter.format(product.price)}
                            </div>
                            <div className="flex gap-1 flex-wrap">
                              {
                                <>
                                  <div>
                                    {product.size == "none" ? null : (
                                      <span className="flex gap-1">
                                        <p className="italic">Tamaño:</p>
                                        {product.size}
                                      </span>
                                    )}
                                    {product.color_1 == "none" ? null : (
                                      <span className="flex gap-1">
                                        <p className="italic">Color 1:</p>
                                        {product.color_1}
                                      </span>
                                    )}
                                    {product.color_2 == "none" ? null : (
                                      <span className="flex gap-1">
                                        <p className="italic">Color 2:</p>
                                        {product.color_2}
                                      </span>
                                    )}
                                    {product.style == "none" ? null : (
                                      <span className="flex gap-1">
                                        <p className="italic">Estilo:</p>
                                        {product.style}
                                      </span>
                                    )}
                                    {product.model == "none" ? null : (
                                      <span className="flex gap-1">
                                        <p className="italic">Modelo:</p>
                                        {product.model}
                                      </span>
                                    )}
                                  </div>
                                </>
                              }
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              removeFromCart({
                                id: product._id,
                                size: product.size,
                                color_1: product.color_1,
                                color_2: product.color_2,
                                style: product.style,
                                model: product.model,
                              } as CartItemType);
                              localStorage.setItem(
                                "my-cart",
                                JSON.stringify("")
                              );
                            }}
                            className="hover:bg-red-500 transition-all duration-150 self-end p-2 mt-4 text-white font-semibold  bg-red-700"
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
              <div className="flex justify-end text-lg mr-2 mt-5 font-bold text-yellow-500">
                <span className="mr-3">Total:</span>
                <span>{formatter.format(totalCartPrice)}</span>
              </div>

              <div className=" bg-yellow-300 p-1 px-3 cursor-pointer mt-3 mr-2 self-end text-center text-black  hover:shadow-md transition-all duration-150 w-44 flex justify-center">
                <button
                  className="font-semibold"
                  onClick={createOrder}
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
              <div className="bg-yellow-300 text-black font-semibold p-1 px-3 cursor-pointer my-6 inline-block  hover:shadow-lg transition-all duration-150">
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
  const client = await clientPromise;
  const db = client.db("klass_ecommerce");
  const products = db.collection("products");
  const promotions = db.collection("promotions");

  const [productList, promotionList]: [ProductType[], PromotionType[]] = await Promise.all([
    products.find({}).toArray(),
    promotions.find({}).toArray()
  ])

  return {
    props: {
      items: productList.map(p => ({ ...p, _id: p._id.toString() })),
      promotions: promotionList.map(p => ({ ...p, _id: p._id.toString() }))
    }
  }
}