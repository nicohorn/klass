import React, { useEffect, useRef, useState } from "react";
import create from "zustand";
import Link from "next/link";
import gsap from "gsap";

const content = [
  { title: "Inicio", url: "/" },
  { title: "Productos", url: "/products" },
  // { title: "Preguntas frecuentes", url: "/faq" },
  { title: "Nosotros", url: "/us" },
];

export const useProducts = create((set) => ({
  cart: [],
  setCart: (items: any) => {
    set((state) => {
      return {
        ...state,
        cart: [...items],
      };
    });
    console.log("Set Cart", items);
  },
  addToCart: (id: any, price: any, option: any) => {
    set((state) => {
      //Función para chequear si el producto ya existe en el carrito
      const isInCart = state.cart.find(
        (product) => product.id == id && product.option == option
      );

      //Si el producto no existe, devuelve el carro con el producto adentro y un count = 1;
      console.log("addToCart", state.cart);
      if (!isInCart) {
        //console.log("Console log desde useProducts", ...state);
        return {
          ...state,
          cart: [...state.cart, { id, option, price, count: 1 }],
        };
      }
      //Recorre el array de productos para ver si encuentra el producto que se quiere agregar, en caso de encontrarlo, suma +1 a su count, si no, queda solo el producto.
      const updatedCart = state.cart.map((product) =>
        product.id === id && product.option == option
          ? { ...product, count: product.count + 1 }
          : product
      );

      return {
        ...state,
        cart: updatedCart,
      };
    });
  },
  removeFromCart: (id, option) =>
    set((state) => {
      const isPresent = state.cart.findIndex(
        (product) => product.id === id && product.option == option
      );

      if (isPresent === -1) {
        return {
          ...state,
        };
      }

      const updatedCart = state.cart
        .map((product) =>
          product.id === id && product.option == option
            ? { ...product, count: Math.max(product.count - 1, 0) }
            : product
        )
        .filter((product) => product.count);

      return {
        ...state,
        cart: updatedCart,
      };
    }),
}));

export default function Navbar(props) {
  let products = useProducts((state: any) => state.cart);

  const getTotalCount = () => {
    let counts = products.map((product) => {
      return product.count;
    });

    let sum = counts.reduce((acc, num) => {
      return acc + num;
    }, 0);

    return sum;
  };

  useEffect(() => {
    gsap.fromTo(
      "#cart-number",
      { opacity: 1, scale: 1.4, x: 0, y: 0 },
      { opacity: 0, scale: 0.2, x: -30, y: -5, duration: 0.4, delay: 0.5 }
    );
  });

  const desktopNav = () => {
    return (
      <div className="hidden md:block">
        <div className="w-full flex py-5 px-20 bg-black gap-10 items-center justify-between">
          <div className="text-4xl font-bold text-white ">
            <img className="h-16" src="/logos-03.png"></img>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/cart">
              <div
                id="cart-icon"
                className="text-white cursor-pointer flex mr-5 items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.3"
                  stroke="currentColor"
                  className="w-12 h-12"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
                <div id="cart-number" className="text-xs text-center">
                  +1
                </div>
              </div>
            </Link>
            <a
              href="https://www.facebook.com/klass.arg"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 fill-white"
              >
                <title>Facebook</title>
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/klass.rosario/"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-white w-7"
              >
                <title>Instagram</title>
                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
              </svg>
            </a>
          </div>
        </div>
        {/* Navbar routes / páginas, segunda mitad */}
        <div className="text-md text-white grow capitalize flex gap-5 bg-black px-20 pb-5">
          {content.map((item, i) => (
            <div
              key={i}
              className="active:scale-90 disabled:scale-100 transition-all duration-150 "
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
        </div>
      </div>
    );
  };

  const mobileNav = () => {
    return (
      <div className="block md:hidden">
        <div className="w-full flex py-5 px-20 bg-black sm:gap-10 gap-5 items-center justify-between flex-col sm:flex-row">
          <div className="text-4xl font-bold text-white ">
            <img className="h-10 sm:h-16" src="/logos-03.png"></img>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/cart">
              <div className="text-white cursor-pointer flex mr-5 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.3"
                  stroke="currentColor"
                  className="w-12 h-12"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
                <div
                  id="cart-icon"
                  className="text-xs -translate-x-[29px] -translate-y-[5px] text-center"
                >
                  {products == "undefined" ? "Carrito vacío" : getTotalCount()}
                </div>
              </div>
            </Link>
            <a
              href="https://www.facebook.com/klass.arg"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 fill-white"
              >
                <title>Facebook</title>
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/klass.rosario/"
              target="_blank"
              rel="noreferrer"
            >
              <svg
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-white w-7"
              >
                <title>Instagram</title>
                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
              </svg>
            </a>
          </div>
        </div>
        {/* Navbar routes / páginas, segunda mitad */}
        <div className="text-md text-white grow capitalize flex gap-5 bg-black px-20 pb-5 justify-center sm:justify-start">
          {content.map((item, i) => (
            <div
              key={i}
              className="active:scale-90 disabled:scale-100 transition-all duration-150 "
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
        </div>
      </div>
    );
  };

  return (
    <nav id="myNavbar" className="">
      {desktopNav()}
      {mobileNav()}
    </nav>
  );
}
