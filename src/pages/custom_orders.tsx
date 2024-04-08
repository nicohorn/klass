import React from "react";
import { CustomOrderType } from "src/utils/types";
import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { supabase } from "supabase";
import { CheckBadgeIcon } from "@heroicons/react/20/solid";
import { toast } from "react-toastify";
import SimpleImageSlider from "react-simple-image-slider";
import Modal from "./components/Modal";

export default function Custom_orders() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [imageLoading, setImageLoading] = useState("nada");
  const [open, setOpen] = useState(false);
  const [isProject, setIsProject] = useState(false);

  let carouselImages = [
    "/carousel/1.jpeg",
    "/carousel/2.jpg",
    "/carousel/3.jpg",
    "/carousel/4.jpeg",
    "/carousel/5.jpeg",
    "/carousel/6.jpeg",
    "/carousel/7.jpeg",
    "/carousel/8.jpeg",
    "/carousel/9.jpeg",
  ];

  useEffect(() => {
    const handleOnMouseMove = (e) => {
      const { currentTarget: target } = e;

      const rect = target.getBoundingClientRect(),
        x = e.clientX - rect.left,
        y = e.clientY - rect.top;

      target.style.setProperty("--mouse-x", `${x}px`);
      target.style.setProperty("--mouse-y", `${y}px`);
    };

    for (const card of document.querySelectorAll(".card") as any) {
      card.onmousemove = (e) => {
        handleOnMouseMove(e);
      };
    }
  });

  const createCustomOrder = async (order: CustomOrderType) => {
    //Once the client is in the cart page, he can delete some products from the cart if needed or wanted, and then he can chose to complete an order, which posts a new order document to mongodb. This is the function that does it.
    setLoading(true);

    const res = await fetch("/api/custom_orders", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    })
      .then((response) => {
        setLoading(false);

        return response.json();
      })
      .then((json) => {});
  };

  const notify = () =>
    toast.success(
      <p>
        <b>Genial! Ya recibimos tu pedido. </b>
        <br />
        En las próximas horas nos estaremos contactando a tu <b>email</b>.
      </p>,
      {
        autoClose: 8000,
      }
    );

  return (
    <main className="w-full text-white flex xl:flex-row flex-col justify-between min-h-screen">
      <div className="md:p-0 p-5  md:mx-20 xl:w-[30%]">
        <div className="mb-6">
          Contamos con fábrica y estudio propio para realizar trabajos
          completamente a medida.
        </div>
        <div className="flex flex-col" id="cards">
          <div
            onClick={() => {
              setOpen(true);
              setIsProject(false);
            }}
            className="card  w-full"
          >
            <div className="p-4">
              <h1 className="font-bold md:text-xl">
                Quiero un mueble personalizado
              </h1>
            </div>
          </div>
          <div
            onClick={() => {
              setOpen(true);
              setIsProject(true);
            }}
            className="card  w-full"
          >
            <div className="p-4">
              <h1 className="font-bold md:text-xl">
                Busco presupuesto para un proyecto{" "}
              </h1>
            </div>
          </div>
        </div>
      </div>
      <Modal></Modal>
      <div className="md:hidden block mx-20 xl:self-auto  self-center xl:mt-0 mt-10 relative">
        <SimpleImageSlider
          width={300}
          height={400}
          images={carouselImages}
          showBullets={true}
          showNavs={true}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      </div>
      <Modal
        imageLoadingState={setImageLoading}
        loading={loading}
        buttonFunction={() => {
          const clientNumber = (
              document.getElementById("celular") as HTMLInputElement
            ).value,
            address = (document.getElementById("direccion") as HTMLInputElement)
              .value,
            message = (document.getElementById("mensaje") as HTMLInputElement)
              .value;

          const pictures = () => {
            if (images) {
              return [...images].map((img) => {
                return (
                  process.env.NEXT_PUBLIC_SUPABASESTORAGE +
                  "personalized-projects/" +
                  img.name
                );
              });
            }
          };

          [...images].forEach(function (image, idx, images) {
            setImageLoading("cargando");
            supabase.storage
              .from("personalized-projects-images")
              .upload(`personalized-projects/${image.name}`, image, {
                cacheControl: "3600",
                upsert: false,
              })
              .then((result) => {
                if (result.error) {
                  console.log("A", result.error);
                } else {
                  setImageLoading("finalizado");
                }
              });
            if (idx === images.length - 1) {
              createCustomOrder({
                userId: user?.sub,
                clientName: user?.name,
                clientEmail: user?.email,
                clientNumber: parseInt(clientNumber),
                address: address,
                message: message,
                images: pictures(),
                createdAt: new Date().toISOString(),
                state: "pending",
                isProject: isProject,
              }).then(() => {
                notify();
              });
            }
          });
        }}
        openModal={open}
        closeModal={setOpen}
        title={
          isProject
            ? "Busco presupuesto para un proyecto"
            : "Quiero un mueble personalizado"
        }
      >
        <div>
          <form className="w-full md:p-5 p-0">
            <input
              value={user && `${user.name}`}
              id="nombre-apellido"
              className="shadow-sm focus:shadow-md w-full my-2 py-1 px-2  focus:border-yellow-400 outline-none focus:bg-yellow-100 transition-all duration-200"
              placeholder="Nombre y apellido"
            />
            <input
              value={user && `${user.email}`}
              id="email"
              className="shadow-sm focus:shadow-md w-full my-2 py-1 px-2  focus:border-yellow-400 outline-none focus:bg-yellow-100 transition-all duration-200"
              placeholder="Tu email"
            />

            <input
              id="celular"
              type="number"
              className="shadow-sm focus:shadow-md w-full my-2 py-1 px-2  focus:border-yellow-400 outline-none focus:bg-yellow-100 transition-all duration-200"
              placeholder="Tu número de celular"
            />
            <input
              id="direccion"
              className="shadow-sm focus:shadow-md w-full my-2 py-1 px-2  focus:border-yellow-400 outline-none focus:bg-yellow-100 transition-all duration-200"
              placeholder={
                isProject ? "Dirección del proyecto" : "Tu dirección"
              }
            />
            <textarea
              id="mensaje"
              placeholder={
                isProject
                  ? "Descripción del proyecto"
                  : "Contanos lo que estás buscando, necesidades a cubrir, materiales, colores, medidas, etc."
              }
              className="shadow-sm focus:shadow-md w-full my-2 py-1 px-2  focus:border-yellow-400 outline-none focus:bg-yellow-100 transition-all duration-200"
            />
            <div className="flex flex-col">
              {" "}
              <label
                className="cursor-pointer mb-1 text-gray-500"
                htmlFor="img-pedido"
              >
                {isProject
                  ? "Imagen o imágenes de referencia"
                  : "¿Tenés alguna imagen de referencia que nos quieras compartir?"}
                <span className="mx-2  py-1 px-2 bg-black/10 hover:text-white transition-all duration-150 hover:bg-black/80 ">
                  Adjuntala acá
                </span>
                {imageLoading == "cargando" ? (
                  <div className="flex flex-col w-full items-center mt-2">
                    <p className="text-sm">Cargando imágenes</p>
                    <p className="mx-3 rotate-center text-center w-1 h-3 mt-2 bg-black/60"></p>
                  </div>
                ) : imageLoading == "finalizado" ? (
                  <p className="text-sm flex gap-1 text-yellow-500">
                    Imágenes cargadas correctamente{" "}
                  </p>
                ) : null}
              </label>
              <input
                onChange={(e) => {
                  setImages(e.target.files as any);
                }}
                className="hidden"
                type="file"
                id="img-pedido"
                name="img"
                accept="image/*"
                multiple
              />
            </div>
          </form>
        </div>
      </Modal>
    </main>
  );
}
