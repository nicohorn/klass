import React from "react";
import { useState, useEffect } from "react";
import { useProducts } from "../layout/navbar";

export default function Cart({ state }: { state: boolean }) {
  const productsCart = useProducts((state: any) => state.cart);
  const [productsCart2, setProductsCart2] = useState();

  useEffect(() => {
    setProductsCart2(JSON.parse(localStorage.getItem("my-cart")));
    console.log("cart component", productsCart2);
  }, []);

  return (
    <div className=" w-96 h-96">
      {/* {" "}
      {cart.map((product) => {
        return (
          <div>
            El carrito re loco
            <div className="flex gap-5">
              <div>{product.id}</div>
              <div>{product.count}</div>
            </div>
          </div>
        );
      })}{" "} */}
    </div>
  );
}
