/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import {
  ColorOptionType,
  OptionType,
  OptionsListType,
  ProductType,
} from "src/utils/types";
import MultipleSelector from "../MultipleSelector";
import Adder from "../Adder";
import CurrencyInput from "../CurrencyInput";
import { parseLocaleNumber } from "src/utils/utils";
import TextEditor from "../TextEditor";
import ModalComponent from "../ModalComponent";
import ProductView from "./ProductView";

export default function ProductForm({
  color_options,
  productCategories,
}: {
  color_options: ColorOptionType[];
  productCategories: Array<string>;
}) {
  const [product, setProduct] = useState<ProductType>();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSizeOptions, setSelectedSizeOptions] = useState<OptionType[]>(
    []
  );
  const [selectedColor_1Options, setSelectedColor_1Options] = useState<
    OptionType[]
  >([]);
  const [selectedColor_2Options, setSelectedColor_2Options] = useState<
    OptionType[]
  >([]);
  const [selectedModelOptions, setSelectedModelOptions] = useState<
    OptionType[]
  >([]);
  const [selectedStyleOptions, setSelectedStyleOptions] = useState<
    OptionType[]
  >([]);

  const [loading, setLoading] = useState(false);

  const productName = useRef<HTMLInputElement>();
  const productPrice = useRef<HTMLInputElement>();
  const [selectedCategories, setCategories] = useState([]);
  const [productDescription, setProductDescription] = useState<string>();
  const productSteel = useRef<HTMLInputElement>();
  const [productImages, setImages] = useState();
  const [previewImages, setPreviewImages] = useState([]);

  const [productOptions, setSelectedOptions] = useState<OptionsListType[]>([
    { name: "size", elements: selectedSizeOptions },
    { name: "color_1", elements: selectedColor_1Options },
    { name: "color_2", elements: selectedColor_2Options },
    { name: "style", elements: selectedStyleOptions },
    { name: "model", elements: selectedModelOptions },
  ]);

  useEffect(() => {
    (document.getElementById("categoriaProducto") as HTMLInputElement).value =
      `${selectedCategories}`.replaceAll(",", "/");

    console.log(product);
  });

  useEffect(() => {
    let images = [];
    productImages &&
      [...productImages].forEach((image) => {
        images.push(URL.createObjectURL(image));
      });
    setPreviewImages(images);
  }, [productImages]);

  const createProduct = async (product: ProductType) => {
    //Once the client is in the cart page, he can delete some products from the cart if needed or wanted, and then he can chose to complete an order, which posts a new order document to mongodb. This is the function that does it.
    setLoading(true);

    await fetch("/api/products/create_product", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })
      .then((response) => {
        setLoading(false);

        return response.json();
      })
      .then((json) => {});
  };

  function productPreview() {
    return;
  }

  return (
    <div className="text-white">
      <h1 className="font-bold text-2xl">Crear nuevo producto</h1>
      <form
        className="mt-2 flex gap-10 flex-col lg:flex-row overflow-x-auto"
        action=""
      >
        <div className="w-[29rem] min-w-[29rem]">
          <div className="flex flex-col pb-2">
            <label htmlFor="nombreProducto" className="text-[.8rem]">
              Nombre del producto
            </label>
            <input
              ref={productName}
              placeholder="Producto nuevo"
              className="bg-primary outline-none text-lg font-semibold focus:border-b-yellow-500 p-1 border-b-white border-b transition-all duration-150"
              id="nombreProducto"
              type="text"
            />
          </div>
          <div className="flex flex-col pb-2">
            <label htmlFor="precioProducto" className="text-[.8rem]">
              Precio del producto
            </label>
            <CurrencyInput productPrice={productPrice} />
          </div>
          <div className="flex flex-col py-2">
            <label htmlFor="categoriaProducto" className="text-[.8rem]">
              Categoría del producto. Si tiene más de una, separar con barra
              diagonal
            </label>
            <div className="flex flex-wrap text-xs mt-1 group">
              {productCategories
                ? productCategories.map((category, i) => {
                    return (
                      <label
                        htmlFor="categoriaProducto"
                        onClick={() => {
                          if (!selectedCategories.includes(category))
                            setCategories([...selectedCategories, category]);
                        }}
                        className={`transition-all duration-150 cursor-pointer  ${
                          selectedCategories.includes(category)
                            ? "opacity-0 w-0 h-0"
                            : "hover:opacity-100 opacity-30 border px-1  mr-1 mb-1"
                        }`}
                        key={i}
                      >
                        {category}
                      </label>
                    );
                  })
                : null}
            </div>
            <input
              onChange={(e) => {
                const handleChange = (e) => {
                  const inputValue = e.target.value;
                  const selectedCategories =
                    inputValue.split("/").length <= 1
                      ? inputValue
                          .split("/")
                          .filter((category) => category.trim() !== "")
                      : inputValue.split("/");

                  if (selectedCategories.length !== 0) {
                    setCategories(selectedCategories);
                  } else {
                    setCategories([]);
                  }
                };
                handleChange(e);
              }}
              value={selectedCategories.join("/")}
              placeholder="Categoría/Subcategoría/Etc"
              className="bg-primary outline-none text-lg font-semibold focus:border-b-yellow-500 p-1 border-b-white border-b transition-all duration-150 mt-1"
              id="categoriaProducto"
              type="text"
            />
          </div>
          <div className="flex flex-col py-2">
            <label className="text-[.8rem] py-2" htmlFor="richtext">
              Descripción
            </label>
            <TextEditor setDescription={setProductDescription} />
          </div>
          <div className="flex py-1 items-center gap-3 ">
            <label className="text-[.8rem] py-2" htmlFor="hasSteel">
              Producto con acero / hierro
            </label>
            <input
              className="w-5 h-5 checked:accent-yellow-500"
              type="checkbox"
              ref={productSteel}
              id="productSteel"
            />
          </div>
        </div>
        <div className="w-[29rem] min-w-[29rem] px-2">
          <div className="flex flex-col gap-3">
            <MultipleSelector
              items={color_options}
              label="Opciones de Color 1"
              hasMultiplier={true}
              setOptions={setSelectedColor_1Options}
              show={true}
            />
            <MultipleSelector
              items={color_options}
              label="Opciones de Color 2"
              hasMultiplier={true}
              setOptions={setSelectedColor_2Options}
              show={false}
            />
            <Adder
              setOptions={setSelectedSizeOptions}
              selectedOptions={selectedSizeOptions}
              label={"Opciones de Tamaño"}
              inputValueId={"sizeInput"}
              inputMultiplierId={"sizeMultiplierInput"}
              inputValuePlaceholder={"xl"}
              inputMultiplierPlaceholder={"1.15"}
              inputValueLabel={"Tamaño"}
              inputMultiplierLabel={"Multiplicador"}
              uppercase={true}
            />
            <Adder
              setOptions={setSelectedModelOptions}
              selectedOptions={selectedModelOptions}
              label={"Opciones de Modelo"}
              inputValueId={"modelInput"}
              inputMultiplierId={"modelMultiplierInput"}
              inputValuePlaceholder={"Modelo"}
              inputMultiplierPlaceholder={"1.25"}
              inputValueLabel={"Modelo"}
              inputMultiplierLabel={"Multiplicador"}
              uppercase={false}
            />
            <Adder
              setOptions={setSelectedStyleOptions}
              selectedOptions={selectedStyleOptions}
              label={"Opciones de Estilo"}
              inputValueId={"styleInput"}
              inputMultiplierId={"styleMultiplierInput"}
              inputValuePlaceholder={"Estilo"}
              inputMultiplierPlaceholder={"1.20"}
              inputValueLabel={"Estilo"}
              inputMultiplierLabel={"Multiplicador"}
              uppercase={false}
            />
          </div>
        </div>
        <div className="w-[29rem] min-w-[29rem] px-2 mb-10">
          <div>
            <p className="mb-4">Imágenes del producto</p>
            <label
              htmlFor="imagenesProducto"
              className="border uppercase px-4 py-2 hover:bg-yellow-500 hover:border-yellow-500 hover:text-black text-sm opacity-100 cursor-pointer transition-all duration-150"
            >
              Subir imágenes{" "}
            </label>
            {productImages ? (
              <div className="flex flex-wrap mt-6 gap-3 opacity-animation">
                {" "}
                {previewImages.map((i, idx) => {
                  return (
                    <img
                      draggable={true}
                      className="w-20 h-20 object-cover border p-1 border-yellow-500"
                      key={idx}
                      src={`${i}`}
                      alt=""
                    />
                  );
                })}
                <span className="text-[.65rem] text-white opacity-50">
                  Vista previa de las imágenes seleccionadas.
                  <br />
                  <br />
                  La primera imagen será la imagen principal del producto.
                  <br />
                  Recordá que el orden de las imágenes está dado por el nombre
                  del archivo (orden alfabético).
                  <br />
                  <br />
                  Es recomendable nombrar los archivos de la siguiente forma:
                  <br />
                  {"=>"} 1_NombreProducto.jpg <br />
                  {"=>"} 2_NombreProducto.jpg <br />
                  {"=>"} 3_NombreProducto.jpg <br />
                  {"=>"} Etc... <br />
                </span>
              </div>
            ) : null}

            <input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const imageFiles: FileList | null = e.target.files;
                setImages(imageFiles as any);
              }}
              className="hidden"
              type="file"
              id="imagenesProducto"
              name="img"
              accept="image/*"
              multiple
            />
          </div>
        </div>
      </form>
      <button
        onClick={() => {
          setProduct({
            name: productName.current.value,
            base_price: parseLocaleNumber(productPrice.current.value, "de-DE"),
            img: previewImages,
            categories:
              `/` + selectedCategories.toString().replaceAll(",", "/"),
            options: [
              { name: "size", elements: selectedSizeOptions },
              { name: "color_1", elements: selectedColor_1Options },
              { name: "color_2", elements: selectedColor_2Options },
              { name: "model", elements: selectedModelOptions },
              { name: "style", elements: selectedStyleOptions },
            ],
            description: productDescription,
            tags: "",
            steel: productSteel.current.checked,
          });

          createProduct({
            name: productName.current.value,
            base_price: parseLocaleNumber(productPrice.current.value, "de-DE"),
            img: [],
            categories:
              `/` + selectedCategories.toString().replaceAll(",", "/"),
            options: [
              { name: "size", elements: selectedSizeOptions },
              { name: "color_1", elements: selectedColor_1Options },
              { name: "color_2", elements: selectedColor_2Options },
              { name: "model", elements: selectedModelOptions },
              { name: "style", elements: selectedStyleOptions },
            ],
            description: productDescription,
            tags: "",
            steel: productSteel.current.checked,
          });

          setModalOpen(true);
        }}
        className="text-primary absolute -bottom-8 right-0 px-6 py-2 text-xl transition-all duration-100 hover:text-white hover:bg-yellow-600 active:scale-95 bg-yellow-500"
      >
        Crear producto
      </button>
      <button>Vista previa del producto</button>
      <ModalComponent
        title="Vista previa del producto a crear"
        isOpen={modalOpen}
        closeModal={() => setModalOpen(false)}
      >
        {product && (
          <ProductView
            preview={true}
            product={product}
            colors={color_options}
          />
        )}
      </ModalComponent>
    </div>
  );
}
