/* eslint-disable @next/next/no-img-element */
import React, { Dispatch } from "react";
import { supabase } from "supabase";

export default function ImagesHandler({
  setPreviewImages,
  setImages,
  previewImages,
  productImages,
  promo,
}: {
  setPreviewImages: React.Dispatch<any>;
  setImages: React.Dispatch<any>;
  previewImages: string[];
  productImages: any[];
  promo?: boolean;
}) {
  const deleteImage = async (imageUrl: string) => {
    const imageName = imageUrl.split("/").at(-1);
    let response;
    const res = supabase.storage
      .from("personalized-projects-images")
      .remove([`product-images/${imageName}`])
      .then((result) => {
        return result;
      });

    response = await res;
    console.log(imageName);
    console.log(response);
    return response;
  };
  return (
    <div>
      <p className="mb-4">
        {promo ? "Imagen de la promoción" : "Imágenes del producto"}
      </p>
      <label
        htmlFor="imagenesProducto"
        className="border uppercase px-4 py-2 hover:bg-yellow-500 hover:border-yellow-500 hover:text-black text-sm opacity-100 cursor-pointer transition-all duration-150"
      >
        {promo ? "Subir imagen" : "Subir imágenes"}
      </label>
      {previewImages.length !== 0 ? (
        <div className="flex flex-wrap mt-6 gap-3 opacity-animation">
          {" "}
          {previewImages.map((i, idx) => {
            return (
              <div key={idx} className="relative">
                <span
                  title="Eliminar"
                  className="absolute -right-1 -top-2 bg-primary border cursor-pointer hover:bg-yellow-500 hover:text-black rounded-full px-1 font-semibold text-xs border-yellow-500 transition"
                  onClick={() => {
                    deleteImage(i);
                    setPreviewImages(
                      previewImages.filter((img) => {
                        return img !== i;
                      })
                    );
                    console.log(
                      [...productImages].map((img) => {
                        return img.name.toString() === i;
                      })
                    );
                  }}
                >
                  x
                </span>
                <img
                  draggable={true}
                  className="w-20 h-20 object-cover border p-1 border-yellow-500"
                  key={idx}
                  src={`${i}`}
                  alt=""
                />
              </div>
            );
          })}
          {!promo && (
            <span className="text-[.65rem] text-white opacity-50">
              Vista previa de las imágenes seleccionadas.
              <br />
              <br />
              La primera imagen será la imagen principal del producto.
              <br />
              Recordá que el orden de las imágenes está dado por el nombre del
              archivo (orden alfabético).
              <br />
              <br />
              Es recomendable nombrar los archivos de la siguiente forma:
              <br />
              {"=>"} 1_NombreProducto.jpg <br />
              {"=>"} 2_NombreProducto.jpg <br />
              {"=>"} 3_NombreProducto.jpg <br />
              {"=>"} Etc... <br />
            </span>
          )}
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
  );
}
