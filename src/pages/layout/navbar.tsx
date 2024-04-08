/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from "react";
import { useProducts } from "../../utils/zustand";
import Link from "next/link";
import Dropdown from "../components/Dropdown";
import { Popover, Transition } from "@headlessui/react";
import { useUser } from "@auth0/nextjs-auth0";
export default function Navbar(props) {
  const { user, error, isLoading } = useUser();
  const setCart = useProducts((state: any) => state.setCart);
  const products = useProducts((state: any) => state.cart);

  useEffect(() => {
    let retrieveLocalStorage = JSON.parse(localStorage.getItem("my-cart"));

    if (retrieveLocalStorage) {
      setCart(retrieveLocalStorage);
    }
  }, []);

  const content = () => {
    if (
      //Admins: Michelle & Nicolas. The route /adminpanel is also protected in the middleware, this is just for frontend purposes
      user?.sub == process.env.NEXT_PUBLIC_ADMIN1 ||
      user?.sub == process.env.NEXT_PUBLIC_ADMIN2
    ) {
      return [
        { title: "Productos", url: "/products" },
        { title: "Nosotros", url: "/us" },
        { title: "Pedidos personalizados", url: "/custom_orders" },
        { title: "Panel de administrador", url: "/adminpanel" },
      ];
    } else {
      return [
        { title: "Productos", url: "/products" },
        { title: "Nosotros", url: "/us" },
        { title: "Pedidos personalizados", url: "/custom_orders" },
      ];
    }
  };

  const options = [
    //Dropdown menu options.
    {
      title: "Mis pedidos",
      href: "/orders",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </svg>
      ),
    },
    {
      title: "Cerrar sesión",
      href: '/api/auth/logout',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
          />
        </svg>
      ),
    },
  ];

  const getTotalCount = () => {
    //Returns the total count of items in the cart
    let counts = products.map((product) => {
      return product.count;
    });

    let sum = counts.reduce((acc, num) => {
      return acc + num;
    }, 0);

    return sum;
  };

  const desktopNav = () => {
    return (
      <nav className="hidden md:block">
        <div className=" flex py-5 mx-20 bg-primary gap-10 items-center justify-between">
          <Link href={"/"} className="text-4xl font-bold text-white ">
            <img alt="image" className="h-16" src="/logos-03.png"></img>
          </Link>
          <div className="flex gap-4 items-center ">
            <Link href="/cart">
              <div
                id="cart-icon"
                className="text-white cursor-pointer flex  items-center group hover:scale-110 transition-all duration-150"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.3"
                  stroke="currentColor"
                  className="w-10 h-10 "
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>

                {products.length != 0 ? (
                  <div
                    id="cart-number"
                    className="h-3 w-3 -translate-x-3  transition-all duration-200 -translate-y-2 rounded-full bg-yellow-500"
                  >
                    {" "}
                  </div>
                ) : (
                  <div
                    id="cart-number"
                    className="h-3 w-3 opacity-0 transition-all duration-200 -translate-x-3 -translate-y-2 rounded-full bg-yellow-500"
                  ></div>
                )}
              </div>
            </Link>
            {user ? (
              <Dropdown options={options} />
            ) : (
              <Link href="/api/auth/login" className="text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="white"
                  className="w-8 h-8 cursor-pointer hover:scale-110 transition-all duration-150"
                >
                  <title>Iniciar Sesión</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>
        {/* Navbar routes / páginas, segunda mitad */}
        <div className="text-md text-white grow capitalize flex gap-5 bg-primary px-20">
          {content().map((item, i) => (
            <div
              key={i}
              className="active:scale-90 disabled transition-all duration-150 "
            >
              <a className="group" href={item.url} key={item.url}>
                <div>
                  {item.title}

                  {props.path &&
                  (props.path == item.url ||
                    props.path.startsWith(item.url)) ? (
                    <div className="h-[1px] bg-yellow-400 w-full transition-all duration-150"></div>
                  ) : (
                    <div className="w-0 h-[1px] bg-yellow-400 group-hover:w-full transition-all duration-150"></div>
                  )}
                </div>
              </a>
            </div>
          ))}
        </div>
      </nav>
    );
  };

  const mobileNav = () => {
    return (
      <div className=" text-white md:hidden">
        {" "}
        <Link href={"/"} className="w-full">
          <img alt="image" className="h-12 mx-auto" src="/logos-03.png"></img>
        </Link>
        <Popover className="relative text-center">
          <Popover.Button>
            <div className="flex flex-col gap-1 items-center">
              <div className="w-4 h-[2px] bg-white"></div>
              <div className="w-6 h-[2px] bg-white"></div>
              <div className="w-4 h-[2px] bg-white"></div>
            </div>
          </Popover.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform  opacity-0"
            enterTo="transform  opacity-100"
            leave="transition duration-150 ease-out"
            leaveFrom="transform  opacity-100"
            leaveTo="transform opacity-0"
          >
            <Popover.Panel className="absolute bg-white py-4 my-4 w-screen text-black flex flex-col gap-2">
              {content().map((item, i) => (
                <div
                  key={i}
                  className="active:scale-90 disabled transition-all duration-150 "
                >
                  <a className="group" href={item.url} key={item.url}>
                    <div>
                      {item.title}

                      {props.path == item.url ? (
                        <div className="h-[1px] bg-white w-full transition-all duration-150"></div>
                      ) : (
                        <div className="w-0 h-[1px] bg-white group-hover:w-full transition-all duration-150"></div>
                      )}
                    </div>
                  </a>
                </div>
              ))}

              <div className=" mx-auto">
                <Link href="/cart">
                  <div id="cart-icon" className="text-black cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.3"
                      stroke="currentColor"
                      className="w-10 h-10 "
                    >
                      <title>
                        {" "}
                        {getTotalCount() != 0
                          ? "Hay " + getTotalCount() + " item/s en el carrito"
                          : "Carrito vacío"}
                      </title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                      />
                    </svg>

                    {products.length != 0 ? (
                      <div
                        id="cart-number"
                        className="h-3 w-3 translate-x-7  transition-all duration-200 -translate-y-9 rounded-full bg-yellow-500"
                      >
                        {" "}
                      </div>
                    ) : (
                      <div
                        id="cart-number"
                        className="h-3 w-3 opacity-0 transition-all duration-200 -translate-x-3 -translate-y-2 rounded-full bg-yellow-500"
                      ></div>
                    )}
                  </div>
                </Link>
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>
      </div>
    );
  };

  return (
    <nav className="py-4 sticky z-50 w-screen" id="myNavbar">
      {desktopNav()}
      {mobileNav()}
    </nav>
  );
}
