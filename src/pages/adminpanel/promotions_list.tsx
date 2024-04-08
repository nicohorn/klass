import clientPromise from "@clientPromise";
import { Router, useRouter } from "next/router";
import React from "react";
import { PromotionType } from "src/utils/types";
import { supabase } from "supabase";

export default function Promotions_list({
  promotions,
}: {
  promotions: PromotionType[];
}) {
  const router = useRouter();
  const deleteImage = async (imageUrl: string) => {
    const imageName = imageUrl.split("/").at(-1);
    let response;
    const res = supabase.storage
      .from("personalized-projects-images")
      .remove([`promo-images/${imageName}`])
      .then((result) => {
        return result;
      });

    response = await res;

    return response;
  };
  return (
    <div className="mx-20 my-10 min-h-[52vh]">
      {promotions.map((promo, idx) => {
        const today = new Date();
        const promoDate = new Date(promo.expiration_date);
        return (
          <div
            className="text-white flex justify-between items-center border-b py-1 border-white/30"
            key={idx}
          >
            <p className="font-bold w-1/2">{promo.name}</p>{" "}
            <p className="w-1/3">Vence el {promoDate.toLocaleDateString()}</p>
            <p className="w-1/4">{today < promoDate ? "Activa" : "Inactiva"}</p>
            <button
              onClick={async () => {
                promo.img.length > 0 && deleteImage(promo.img[0]);
                fetch("/api/promotions/delete_promo", {
                  method: "DELETE",
                  mode: "cors",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(promo),
                })
                  .then((response) => {
                    return response.json();
                  })
                  .then((json) => {
                    console.log(json);
                    router.reload();
                  });
              }}
              className="text-amber-600 "
            >
              Eliminar
            </button>
          </div>
        );
      })}
    </div>
  );
}

export async function getServerSideProps(context) {
  const client = await clientPromise;
  const db = client.db("klass_ecommerce");
  const collection = db.collection("promotions");

  const promotionsResponse = await collection.find({}).toArray();

  return {
    props: {
      promotions: promotionsResponse.map((item) => {
        return {
          ...item,
          _id: item._id.toString(),
        };
      }),
    },
  };
}
