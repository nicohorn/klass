import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Index() {
  const router = useRouter();

  useEffect(() => {}, []);

  return (
    <div className="h-[65vh] text-white">
      <div className="mx-20 flex flex-col gap-3 text-xl ">
        <p className="hover:font-bold transition-all duration-150">
          <Link href="/adminpanel/orders/1">Pedidos</Link>
        </p>
        <p className="hover:font-bold transition-all duration-150">
          <Link href="/adminpanel/custom_orders/1">Pedidos personalizados</Link>
        </p>
      </div>
    </div>
  );
}
