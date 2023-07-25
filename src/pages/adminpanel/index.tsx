import React from "react";
import Link from "next/link";

export default function Page() {
  const updateAllPrices = async (multiplier: number) => {
    await fetch("/api/products/updateAllPrices", {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(multiplier),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        console.log(
          "Se actualizaron los precios de todos los productos ",
          json
        );
      });
  };

  const updateSteelPrices = async (multiplier: number) => {
    await fetch("/api/products/updateSteelPrices", {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(multiplier),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        console.log(json);
      });
  };

  return (
    <div className="h-[65vh] text-white">
      <div className="mx-20 flex flex-col gap-3 text-xl ">
        <p className="hover:font-bold transition-all duration-150 w-fit">
          <Link href="/adminpanel/newProduct">Crear un producto nuevo</Link>
        </p>
        <p className="hover:font-bold transition-all duration-150 w-fit">
          <Link href="/adminpanel/orders">Pedidos</Link>
        </p>
        <p className="hover:font-bold transition-all duration-150 w-fit">
          <Link href="/adminpanel/custom_orders">Pedidos personalizados</Link>
        </p>
        <div className="flex gap-4 items-center">
          Actualizar todos los precios{" "}
          <span>
            <input
              id="multiplier"
              maxLength={3}
              className="w-14 text-black px-2 text-center"
            />{" "}
            %
          </span>
          <button
            className="text-sm border px-2 py-1 border-white hover:bg-white hover:text-black transition-all duration-150 active:scale-95"
            onClick={() => {
              const percentage =
                Number(
                  (document.getElementById("multiplier") as HTMLInputElement)
                    .value
                ) / 10;

              let multiplier =
                percentage < 10 && percentage >= 1
                  ? Number(1 + "." + percentage * 10)
                  : percentage < 1
                  ? Number(1 + ".0" + percentage * 10)
                  : percentage / 10 + 1;

              updateAllPrices(multiplier);
            }}
          >
            Actualizar
          </button>
        </div>
        <div className="flex gap-4 items-center">
          Actualizar precios de productos con hierro{" "}
          <span>
            <input
              id="multiplier2"
              maxLength={3}
              className="w-14 text-black px-2 text-center"
            />{" "}
            %
          </span>
          <button
            className="text-sm border px-2 py-1 border-white hover:bg-white hover:text-black transition-all duration-150 active:scale-95"
            onClick={() => {
              const percentage =
                Number(
                  (document.getElementById("multiplier2") as HTMLInputElement)
                    .value
                ) / 10;

              let multiplier =
                percentage < 10 && percentage >= 1
                  ? Number(1 + "." + percentage * 10)
                  : percentage < 1
                  ? Number(1 + ".0" + percentage * 10)
                  : percentage / 10 + 1;

              updateSteelPrices(multiplier);
            }}
          >
            Actualizar
          </button>
        </div>
      </div>
    </div>
  );
}
