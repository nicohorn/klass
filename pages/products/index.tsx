import React from "react";
import { useEffect, useState, useLayoutEffect } from "react";
import { useProducts } from "../layout/navbar";

const createNewProduct = async (params: {
  img: string;
  productName: string;
  id: number;
}) => {
  console.log("hola");
  const res = await fetch("/api/products", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  const data = await res.json();

  console.log(data);
};

function Products(obj: { items }) {
  const [toggle, setToggle] = useState(false);
  const addToCart = useProducts((state: any) => state.addToCart);
  const setCart = useProducts((state: any) => state.setCart);
  let productsCart = useProducts((state: any) => state.cart);

  useEffect(() => {
    console.log("localStorage wacho", localStorage.getItem("my-cart"));
    let retrieveLocalStorage = JSON.parse(localStorage.getItem("my-cart"));

    //console.log("Retrieve Local Storage", retrieveLocalStorage);
    if (retrieveLocalStorage) {
      setCart(retrieveLocalStorage);
    }
  }, []);

  useEffect(() => {
    console.log("this little shit is making me waste time", productsCart);

    if (JSON.stringify(productsCart) != "[]") {
      localStorage.setItem("my-cart", JSON.stringify(productsCart));
    }
  });

  // useEffect(() => {
  //   console.log("toggle", productsCart);
  //   localStorage.setItem("my-cart", JSON.stringify(productsCart));
  // }, [toggle]);

  return (
    <div className="w-full flex-grow">
      <div className="flex h-full">
        {obj.items.slice(0, 5).map((item, i) => (
          <div
            key={i}
            style={{ backgroundImage: `url(${item.img})` }}
            className={`flex-[0.5] bg-cover bg-center bg-no-repeat hover:flex-[0.6] transition-all duration-300 group grid hover:p-20`}
          >
            <a href={`/products/` + item._id}>
              <div className="group-hover:opacity-100 opacity-0 text-4xl font-bold transition-all duration-500">
                <p className="bg-black text-white bg-opacity-40 drop-shadow p-5">
                  {item.name}
                </p>
              </div>
            </a>
            <button
              onClick={() => {
                setToggle(!toggle);
                addToCart(item._id);
              }}
              className="text-white bg-black "
            >
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const res = await fetch("http://localhost:3000/api/products");
  const items = await res.json();

  // By returning { props: { items } }, the Products component
  // will receive `items` as a prop at build time
  return {
    props: {
      items,
    },
  };
}

export default Products;
