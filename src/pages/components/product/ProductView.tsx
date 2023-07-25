import React from "react";
import { CartItemType, OptionType, ProductType } from "src/utils/types";
import SimpleImageSlider from "react-simple-image-slider";
import { formatter } from "src/utils/utils";

export default function ProductView({
  product,
  selectedSize,
  selectedColor_1,
  selectedColor_2,
  selectedStyle,
  selectedModel,
  listboxOptions,
  addToCart,
}: {
  product?: ProductType;
  selectedSize: OptionType;
  selectedColor_1: OptionType;
  selectedColor_2: OptionType;
  selectedStyle: OptionType;
  selectedModel: OptionType;
  listboxOptions: React.JSX.Element;
  addToCart: Function;
}) {
  function imageSlider() {
    return (
      <>
        {product && (
          <>
            <div className="sm:block hidden">
              <SimpleImageSlider
                width={500}
                height={650}
                images={product.img}
                showBullets={true}
                showNavs={true}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: "auto",
                }}
              />
            </div>
            <div className="sm:hidden block">
              <SimpleImageSlider
                width={320}
                height={400}
                images={product.img}
                showBullets={true}
                showNavs={true}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            </div>
          </>
        )}
      </>
    );
  }
  function totalPrice() {
    const total =
      product &&
      product.base_price +
        (selectedSize.multiplier * product.base_price - product.base_price) +
        (selectedColor_1.multiplier * product.base_price - product.base_price) +
        (selectedColor_2.multiplier * product.base_price - product.base_price) +
        (selectedStyle.multiplier * product.base_price - product.base_price) +
        (selectedModel.multiplier * product.base_price - product.base_price);

    const totalToNeareastFive = Math.ceil(total / 5) * 5;

    return totalToNeareastFive;
  }
  return (
    <section className="flex  justify-center h-full lg:mx-20 items-center rounded-md shadow-inner bg-primary  p-5 lg:p-0  xl:flex-row flex-col  gap-5 ">
      <div className="relative aspect-[4/5] h-full  xl:mx-0  group text-xl ">
        {imageSlider()}
      </div>
      <div className="self-center xl:self-stretch flex-1 z-40 bg-white rounded-md">
        <div className=" flex flex-col gap-5   mr-0 shadow-lg h-full p-5 lg:p-10">
          <h1 className="font-bold text-3xl lg:text-3xl ">
            {product && product.name}
          </h1>

          <h2
            key={totalPrice()}
            className="text-2xl text-lime-700 font-bold tilt-in-fwd-tr text-yellow-600"
          >
            {product && product.base_price === 1
              ? "Presupuestar"
              : formatter.format(totalPrice())}
          </h2>

          <p className="text-md whitespace-pre-wrap leading-5 ">
            {product && product.description}
          </p>

          {listboxOptions}

          {product && product.base_price !== 1 && (
            <button
              className="bg-yellow-300 p-3 font-semibold rounded-md w-[100%] mt-auto  text-black active:scale-95 transition-all duration-150 hover:drop-shadow-md hover:bg-yellow-400 "
              onClick={() => {
                addToCart({
                  id: product._id,
                  price: totalPrice(),
                  size: selectedSize.value,
                  color_1: selectedColor_1.value,
                  color_2: selectedColor_2.value,
                  style: selectedStyle.value,
                  model: selectedModel.value,
                } as CartItemType);
              }}
            >
              Agregar al carrito
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
