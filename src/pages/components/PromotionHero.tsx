import React from "react";
import { CartItemType, PromotionType } from "src/utils/types";
import Tiptap from "./TextEditor";
import useProducts from "src/utils/zustand";
import Image from "next/image";
import { formatter } from "src/utils/utils";

export default function PromotionHero(promotion: PromotionType) {
  const addToCart = useProducts((state: any) => state.addToCart);

  return (
    <div className="flex flex-col lg:flex-row lg:max-h-[50vh] md:mx-20 py-3 px-8 md:px-0 gap-10 mb-20 justify-between">
      <div className="  text-white flex flex-col gap-3 ">
        <h1 className="font-bold text-6xl leading-snug">{promotion.name}</h1>
        <div className="min-w-full">
          <Tiptap content={promotion.description} editable={false} />
        </div>
        <div className="text-yellow-300 font-bold text-4xl">
          {formatter.format(promotion.price)}
        </div>
        <button
          className="bg-yellow-300 p-3 font-semibold   text-black active:scale-95 transition-all duration-150 hover:drop-shadow-md hover:bg-yellow-400 w-72 mt-5"
          onClick={() => {
            console.log(promotion);
            addToCart({
              id: promotion._id,
              price: promotion.price,
              size: "none",
              color_1: "none",
              color_2: "none",
              style: "none",
              model: "none",
            } as CartItemType);
          }}
        >
          Agregar al carrito
        </button>
      </div>
      <div className="lg:max-w-[30%]">
        {promotion.img?.length > 0 && (
          <Image
            width={750}
            height={750}
            alt="Imagen de la promoción"
            src={promotion.img[0]}
            unoptimized
          ></Image>
        )}
      </div>
    </div>
  );
}
