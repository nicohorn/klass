import React from "react";
import PromotionForm from "../components/promotion/PromotionForm";
import { ProductType } from "src/utils/types";
import clientPromise from "@clientPromise";

export default function NewPromotion() {
  return (
    <main className="relative min-h-[72vh] mx-20 text-white">
      <PromotionForm />
    </main>
  );
}
