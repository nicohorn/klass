import React from "react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="h-[65vh] text-white">
      <div className="mx-20 flex flex-col gap-3 text-xl ">
        <p className="hover:font-bold transition-all duration-150">
          <Link href="/adminpanel/orders">Pedidos</Link>
        </p>
        <p className="hover:font-bold transition-all duration-150">
          <Link href="/adminpanel/custom_orders">Pedidos personalizados</Link>
        </p>
      </div>
    </div>
  );
}
