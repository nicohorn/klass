import React, { useState } from "react";
import {
  CartItemType,
  ColorOptionType,
  OptionType,
  ProductType,
} from "src/utils/types";
import SimpleImageSlider from "react-simple-image-slider";
import { formatter } from "src/utils/utils";
import OptionsListbox from "../OptionsListbox";
import Tiptap from "../TextEditor";
import { useUser } from "@auth0/nextjs-auth0";

export default function ProductView({
  product,
  colors,
  addToCart,
  preview,
  editProduct,
}: {
  product?: ProductType;
  colors: ColorOptionType[];
  addToCart?: Function;
  preview?: boolean;
  editProduct?: React.Dispatch<boolean>;
}) {
  const size_options =
    product &&
    product.options.find((optionList) => {
      return optionList.name === "size";
    })?.elements;
  const color_1_options =
    product &&
    product.options.find((optionList) => {
      return optionList.name === "color_1";
    })?.elements;
  const color_2_options =
    product &&
    product.options.find((optionList) => {
      return optionList.name === "color_2";
    })?.elements;
  const style_options =
    product &&
    product.options.find((optionList) => {
      return optionList.name === "style";
    })?.elements;
  const model_options =
    product &&
    product.options.find((optionList) => {
      return optionList.name === "model";
    })?.elements;

  //This useState hook holds one of the options with its price that was selected from the product (in case of having an option to chose, e.g. S, M, L, etc)
  const [selectedSize, setSelectedSize] = useState<OptionType>(
    size_options ? size_options[0] : null
  );
  const [selectedColor_1, setSelectedColor_1] = useState<OptionType>(
    color_1_options ? color_1_options[0] : null
  );
  const [selectedColor_2, setSelectedColor_2] = useState<OptionType>(
    color_2_options ? color_2_options[0] : null
  );

  const [selectedStyle, setSelectedStyle] = useState<OptionType>(
    style_options ? style_options[0] : null
  );

  const [selectedModel, setSelectedModel] = useState<OptionType>(
    model_options ? model_options[0] : null
  );

  const { user } = useUser();

  function listboxOptions() {
    return (
      <>
        {product && (
          <div className="flex gap-5 flex-col  ">
            <OptionsListbox
              title="Tamaño"
              selectedOption={selectedSize}
              setSelectedOption={setSelectedSize}
              options={size_options}
            />

            <OptionsListbox
              title="Color 1"
              selectedOption={selectedColor_1}
              setSelectedOption={setSelectedColor_1}
              options={color_1_options}
              colors={colors}
            />

            <OptionsListbox
              title="Color 2"
              selectedOption={selectedColor_2}
              setSelectedOption={setSelectedColor_2}
              options={color_2_options}
              colors={colors}
            />

            <OptionsListbox
              title="Estilo"
              selectedOption={selectedStyle}
              setSelectedOption={setSelectedStyle}
              options={style_options}
            />
            <OptionsListbox
              title="Modelo"
              selectedOption={selectedModel}
              setSelectedOption={setSelectedModel}
              options={model_options}
            />
          </div>
        )}
      </>
    );
  }

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
        ((selectedSize?.multiplier || 1) * product.base_price -
          product.base_price) +
        ((selectedColor_1?.multiplier || 1) * product.base_price -
          product.base_price) +
        ((selectedColor_2?.multiplier || 1) * product.base_price -
          product.base_price) +
        ((selectedStyle?.multiplier || 1) * product.base_price -
          product.base_price) +
        ((selectedModel?.multiplier || 1) * product.base_price -
          product.base_price);

    const totalToNeareastFive = Math.ceil(total / 5) * 5;

    return totalToNeareastFive;
  }

  return (
    <section className="flex  justify-center h-full lg:mx-20 items-center  p-5 lg:p-0  xl:flex-row flex-col  gap-5 ">
      <div className="relative aspect-[4/5] h-full  xl:mx-0  group text-xl ">
        {imageSlider()}
      </div>
      <div className="self-center xl:self-stretch flex-1 z-40 bg-white ">
        <div className=" flex flex-col gap-5   mr-0 h-full p-5 lg:p-10">
          <h1 className="font-bold text-3xl lg:text-3xl ">
            {product && product.name}
            {product && preview && product.steel ? (
              <p className="text-xs">Tiene acero/hierro</p>
            ) : null}
          </h1>

          <h2 className="text-primary/70 font-semibold">
            {preview && "Categorías: "}
            {preview && product && product.categories}
          </h2>

          <h2
            key={totalPrice()}
            className="text-2xl text-lime-700 font-bold tilt-in-fwd-tr text-yellow-600"
          >
            {product && product.base_price === 1
              ? "Presupuestar"
              : formatter.format(totalPrice())}
          </h2>

          <p className="text-md whitespace-pre-wrap leading-5 ">
            {product && (
              <Tiptap content={product.description} editable={false} />
            )}
          </p>

          {listboxOptions()}

          {product && product.base_price !== 1 && preview !== true && (
            <div className="flex gap-2 mt-auto ">
              <button
                className="bg-yellow-300 p-3 font-semibold  w-[100%]  text-black active:scale-95 transition-all duration-150 hover:drop-shadow-md hover:bg-yellow-400 "
                onClick={() => {
                  addToCart({
                    id: product._id,
                    price: totalPrice(),
                    size: selectedSize?.value || "none",
                    color_1: selectedColor_1?.value || "none",
                    color_2: selectedColor_2?.value || "none",
                    style: selectedStyle?.value || "none",
                    model: selectedModel?.value || "none",
                  } as CartItemType);
                }}
              >
                Agregar al carrito
              </button>
              {user?.sub === process.env.NEXT_PUBLIC_ADMIN1 ||
              user?.sub === process.env.NEXT_PUBLIC_ADMIN1 ? (
                <button
                  className="bg-yellow-300 p-3 font-semibold  w-[100%] mt-auto  text-black active:scale-95 transition-all duration-150 hover:drop-shadow-md hover:bg-yellow-400 "
                  onClick={() => editProduct(true)}
                >
                  Editar producto
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
