/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { MantineProvider } from "@mantine/core";
import { ColorOptionType, OptionType, ProductType } from "src/utils/types";
import MultipleSelector from "../MultipleSelector";
import Adder from "../Adder";
import CurrencyInput from "../CurrencyInput";
import { parseLocaleNumber } from "src/utils/utils";

export default function ProductForm({
  color_options,
  productCategories,
  setProduct,
}: {
  color_options: ColorOptionType[];
  productCategories: Array<string>;
  setProduct: React.Dispatch<ProductType>;
}) {
  const [editorFocus, setEditorFocus] = useState(false);
  const [anotherP, setanotherP] = useState<ProductType>();
  const [selectedSizeOptions, setSelectedSizeOptions] = useState<OptionType[]>([
    { value: "none", multiplier: 1 },
  ]);
  const [selectedColor_1Options, setSelectedColor_1Options] = useState<
    OptionType[]
  >([{ value: "none", multiplier: 1 }]);
  const [selectedColor_2Options, setSelectedColor_2Options] = useState<
    OptionType[]
  >([{ value: "none", multiplier: 1 }]);
  const [selectedModelOptions, setSelectedModelOptions] = useState<
    OptionType[]
  >([{ value: "none", multiplier: 1 }]);
  const [selectedStyleOptions, setSelectedStyleOptions] = useState<
    OptionType[]
  >([{ value: "none", multiplier: 1 }]);

  const productName = useRef<HTMLInputElement>();
  const productPrice = useRef<HTMLInputElement>();
  const [selectedCategories, setCategories] = useState([]);

  const [productOptions, setSelectedOptions] = useState([
    selectedSizeOptions,
    selectedColor_1Options,
    selectedColor_2Options,
    selectedStyleOptions,
    selectedModelOptions,
  ]);

  useEffect(() => {
    (document.getElementById("categoriaProducto") as HTMLInputElement).value =
      `${selectedCategories}`.replaceAll(",", "/");
  });

  function MantineEditor() {
    const editor = useEditor({
      extensions: [StarterKit, Link],
    });

    return (
      <MantineProvider
        theme={{
          colorScheme: "dark",
          colors: {
            // override dark colors here to change them for all components
            dark: [
              "#d5d7e0",
              "#acaebf",
              "#8c8fa3",
              "#666980",
              "#4d4f66",
              "#34354a",
              "#2b2c3d",
              "#090f0f",
              "#0c0d21",
              "#01010a",
            ],
          },
        }}
      >
        <RichTextEditor
          onFocus={() => setEditorFocus(true)}
          onBlur={() => {
            setEditorFocus(false);
          }}
          className={`rounded-none border transition-all duration-150  ${
            editorFocus ? "border-yellow-500" : "border-white"
          }`}
          editor={editor}
        >
          <RichTextEditor.Toolbar className="p-2 flex">
            <RichTextEditor.ControlsGroup className="mr-2">
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>

          <RichTextEditor.Content
            id="richtext"
            className="text-sm h-full overflow-auto"
          />
        </RichTextEditor>
      </MantineProvider>
    );
  }

  return (
    <div className="text-white">
      <h1 className="font-bold text-2xl">Crear nuevo producto</h1>
      <form className="pt-2 flex gap-10 flex-col lg:flex-row" action="">
        <div className="w-[30rem]">
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
              diagonal ( / )
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
                  const selectedCategories = inputValue
                    .split("/")
                    .filter((category) => category.trim() !== "");

                  if (selectedCategories.length !== 0) {
                    setCategories(selectedCategories);
                  } else {
                    setCategories([]);
                  }
                };
                handleChange(e);
              }}
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
            {MantineEditor()}
          </div>
        </div>
        <div className="w-[30rem] overflow-auto px-2">
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
      </form>
      <button
        onClick={() => {
          setProduct({
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
            description: "",
            tags: "",
            steel: false,
          });
        }}
        className="text-primary absolute -bottom-8 right-0 px-6 py-2 text-xl transition-all duration-100 hover:text-white hover:bg-yellow-600 active:scale-95 bg-yellow-500"
      >
        Crear producto
      </button>
    </div>
  );
}
