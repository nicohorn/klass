/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useRef, useState } from "react";
import { ProductType, PromotionType } from "src/utils/types";
import TextEditor from "../TextEditor";
import CurrencyInput from "../CurrencyInput";
import ImagesHandler from "../product/ImagesHandler";
import { supabase } from "supabase";
import { notify, parseLocaleNumber } from "src/utils/utils";
import { useRouter } from "next/router";

export default function PromotionForm() {
  const router = useRouter();
  const promoName = useRef<HTMLInputElement>();
  const [promoDescription, setPromoDescription] = useState<string>();

  const promoPrice = useRef<HTMLInputElement>();
  const promoExpDate = useRef<HTMLInputElement>();

  const [loading, setLoading] = useState(false);
  const [promoImages, setPromoImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const todayDate = () => {
    let today = new Date(),
      day = (today.getDate() + 1).toString(),
      month = (today.getMonth() + 1).toString(), //January is 0
      year = today.getFullYear().toString();
    if (Number(day) < 10) {
      day = "0" + day;
    }
    if (Number(month) < 10) {
      month = "0" + month;
    }
    return year + "-" + month + "-" + day;
  };

  useEffect(() => {
    console.log(todayDate());
  });

  useEffect(() => {
    let images = [];
    promoImages &&
      [...promoImages].forEach((image) => {
        images.push(URL.createObjectURL(image));
      });
    setPreviewImages([...previewImages, ...images]);
  }, [promoImages]);
  async function imagesUpload(images: any[]) {
    setLoading(true);
    const pictures = () => {
      if (images) {
        return [...images].map((img) => {
          return (
            process.env.NEXT_PUBLIC_SUPABASESTORAGE +
            "promo-images/" +
            img.name.toString().replaceAll(" ", "_")
          );
        });
      }
    };

    const imagesArray = [...images];

    let response;

    for (const image of imagesArray) {
      const res = supabase.storage
        .from("personalized-projects-images")
        .upload(
          `promo-images/${image.name.toString().replaceAll(" ", "_")}`,
          image,
          {
            cacheControl: "3600",
            upsert: false,
          }
        )
        .then((result) => {
          return result;
        });

      response = await res;
    }

    if (response.error) {
      setLoading(false);

      notify("Las imágenes del producto ya existen en la base de datos");
      return null;
    } else {
      setLoading(false);
      return pictures();
    }
  }
  const createPromo = async (promotion: PromotionType) => {
    await fetch("/api/promotions/create_promo", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(promotion),
    }).then((response) => {
      setLoading(false);

      return response.json().then((res) => {
        if (res) router.push("/");
        else router.reload();
      });
    });
  };
  return (
    <form className="max-w-full xl:w-1/3 flex flex-col gap-4">
      <h1 className="text-2xl font-bold ">Nueva promoción</h1>
      <div className="flex flex-col gap-2">
        <label htmlFor="promo_name">Nombre de la promoción</label>
        <input
          ref={promoName}
          id="promo_name"
          className="bg-primary outline-none text-lg font-semibold focus:border-b-yellow-500 p-1 border-b-white border-b transition-all duration-150"
          placeholder="Promo verano 10% off en todo"
        ></input>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="text-editor">Descripción</label>
        <TextEditor
          setDescription={setPromoDescription}
          content="Descripción de la promoción"
        ></TextEditor>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="promo_price">Precio total</label>
        <CurrencyInput productPrice={promoPrice} />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="promo_expiration_date">Fecha de vencimiento</label>
        <input
          ref={promoExpDate}
          min={todayDate()}
          className="bg-primary outline-none text-lg font-semibold focus:border-b-yellow-500 p-1 border-b-white border-b transition-all duration-150"
          id="promo_expiration_date"
          type="date"
        ></input>
        <p className="text-xs text-white/50">
          Mientras no esté vigente la fecha de vencimiento (o posterior), la
          promoción permanecerá activa y se mostrará en la página principal. En
          el caso contrario, la promoción no será visible en la página
          principal.
        </p>
      </div>
      <div>
        <ImagesHandler
          setImages={setPromoImages}
          setPreviewImages={setPreviewImages}
          productImages={promoImages}
          previewImages={previewImages}
          promo={true}
        ></ImagesHandler>
      </div>
       
      <button
        className="text-primary absolute -bottom-8 right-0 px-6 py-2 text-xl transition-all duration-100 hover:text-white hover:bg-yellow-600 active:scale-95 bg-yellow-500"
        onClick={async (e) => {
          e.preventDefault();
          console.log(parseLocaleNumber(promoPrice.current.value, "de-DE"));
          const images = await imagesUpload(promoImages);
          createPromo({
            title: promoName.current.value,
            description: promoDescription,
            price: parseLocaleNumber(promoPrice.current.value, "de-DE"),
            promo_image: images,
            expiration_date: promoExpDate.current.value,
          });
        }}
      >
        Crear promoción
      </button>
    </form>
  );
}
