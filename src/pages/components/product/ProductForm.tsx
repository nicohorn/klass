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
import { supabase } from "supabase";
import { notify } from "src/utils/utils";
import { useRouter } from "next/router";
import ImagesHandler from "./ImagesHandler";

export default function ProductForm({
  color_options,
  productCategories,
  productToEdit,
}: {
  color_options: ColorOptionType[];
  productCategories: Array<string>;
  productToEdit?: ProductType;
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

  const router = useRouter();

  const productName = useRef<HTMLInputElement>();
  const productPrice = useRef<HTMLInputElement>();
  const [selectedCategories, setCategories] = useState(
    productToEdit?.categories.split("/").slice(1) || []
  );
  const [productDescription, setProductDescription] = useState<string>();
  const productSteel = useRef<HTMLInputElement>();
  const [productImages, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState(
    [...productToEdit.img] || []
  );

  useEffect(() => {
    (document.getElementById("categoriaProducto") as HTMLInputElement).value =
      `${selectedCategories}`.replaceAll(",", "/");
  });

  useEffect(() => {
    (document.getElementById("nombreProducto") as HTMLInputElement).value =
      productToEdit?.name || "";

    productToEdit &&
      setSelectedSizeOptions(
        productToEdit.options[
          productToEdit.options.indexOf(
            productToEdit.options.find((e) => {
              return e.name == "size";
            })
          )
        ]?.elements
      );

    productToEdit &&
      setSelectedModelOptions(
        productToEdit.options[
          productToEdit.options.indexOf(
            productToEdit.options.find((e) => {
              return e.name == "model";
            })
          )
        ]?.elements
      );

    productToEdit &&
      setSelectedStyleOptions(
        productToEdit.options[
          productToEdit.options.indexOf(
            productToEdit.options.find((e) => {
              return e.name == "style";
            })
          )
        ]?.elements
      );

    (document.getElementById("productSteel") as HTMLInputElement).checked =
      productToEdit?.steel || false;
  }, []);

  useEffect(() => {
    let images = [];
    productImages &&
      [...productImages].forEach((image) => {
        images.push(URL.createObjectURL(image));
      });
    setPreviewImages([...previewImages, ...images]);
  }, [productImages]);

  const createProduct = async (product: ProductType) => {
    await fetch("/api/products/create_product", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    }).then((response) => {
      setLoading(false);

      return response.json().then((res) => {
        router.push(`/products/${res._id}`);
      });
    });
  };

  const updateProduct = async (product: ProductType, productId: string) => {
    const bodyObject = { product, productId };

    await fetch("/api/products/update_product", {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyObject),
    })
      .then((response) => {
        setLoading(false);

        return response.json();
      })
      .then((json) => {});
  };

  async function imagesUpload(images: any[]) {
    setLoading(true);
    const pictures = () => {
      if (images) {
        return [...images].map((img) => {
          return (
            process.env.NEXT_PUBLIC_SUPABASESTORAGE +
            "product-images/" +
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
          `product-images/${image.name.toString().replaceAll(" ", "_")}`,
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
      setModalOpen(false);
      notify("Las imágenes del producto ya existen en la base de datos");
      return null;
    } else {
      setLoading(false);
      setModalOpen(false);
      return pictures();
    }
  }

  return (
    <div className="text-white opacity-animation">
      <h1 className="font-bold text-2xl">
        {!productToEdit ? "Crear nuevo producto" : "Editar producto"}
      </h1>
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
            <CurrencyInput
              productPrice={productPrice}
              defaultPrice={productToEdit?.base_price}
            />
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
            <TextEditor
              content={productToEdit?.description}
              setDescription={setProductDescription}
            />
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
              content={
                productToEdit.options[
                  productToEdit.options.indexOf(
                    productToEdit.options.find((e) => {
                      return e.name == "color_1";
                    })
                  )
                ]?.elements
              }
            />
            <MultipleSelector
              items={color_options}
              label="Opciones de Color 2"
              hasMultiplier={true}
              setOptions={setSelectedColor_2Options}
              show={false}
              content={
                productToEdit.options[
                  productToEdit.options.indexOf(
                    productToEdit.options.find((e) => {
                      return e.name == "color_2";
                    })
                  )
                ]?.elements
              }
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
          <ImagesHandler
            setImages={setImages}
            setPreviewImages={setPreviewImages}
            productImages={productImages}
            previewImages={previewImages}
          ></ImagesHandler>
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

          setModalOpen(true);
        }}
        className="text-primary absolute -bottom-8 right-0 px-6 py-2 text-xl transition-all duration-100 hover:text-white hover:bg-yellow-600 active:scale-95 bg-yellow-500"
      >
        {productToEdit ? "Actualizar producto" : "Crear"}
      </button>

      <ModalComponent
        buttonTitle={productToEdit ? "Actualizar producto" : "Crear"}
        title="Vista previa del producto a crear"
        isOpen={modalOpen}
        closeModal={() => setModalOpen(false)}
        loading={loading}
        buttonFunction={
          productToEdit
            ? async () => {
                const uploadedImages = null;
                uploadedImages
                  ? updateProduct(
                      {
                        name: productName.current.value,
                        base_price: parseLocaleNumber(
                          productPrice.current.value,
                          "de-DE"
                        ),
                        img: productToEdit.img,
                        categories:
                          `/` +
                          selectedCategories.toString().replaceAll(",", "/"),
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
                      },
                      productToEdit._id
                    )
                  : null;
              }
            : async () => {
                const uploadedImages = await imagesUpload(productImages);
                uploadedImages
                  ? createProduct({
                      name: productName.current.value,
                      base_price: parseLocaleNumber(
                        productPrice.current.value,
                        "de-DE"
                      ),
                      img: uploadedImages,
                      categories:
                        `/` +
                        selectedCategories.toString().replaceAll(",", "/"),
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
                    })
                  : null;
              }
        }
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
