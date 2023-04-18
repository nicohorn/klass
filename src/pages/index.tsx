import React from "react";
import { useEffect, useState, useLayoutEffect } from "react";
import { useProducts } from "../utils/zustand";
import clientPromise from "../../mongodb";
import { useUser } from "@auth0/nextjs-auth0";
import ProductContainer from "./components/productContainer";
import Link from "next/link";
import Modal from "./components/modal";
import { supabase } from "supabase.js";
import { useRouter } from "next/router";
import { CheckBadgeIcon } from "@heroicons/react/20/solid";
import { toast } from "react-toastify";
import Message from "./components/message";
import { formatter } from "utils";
import { Custom_Order } from "types";
import { supabase_images_url } from "utils";
import { Cookie } from "@mui/icons-material";

export default function Home({ products }) {
  const setCart = useProducts((state: any) => state.setCart);
  let productsCart = useProducts((state: any) => state.cart);
  const router = useRouter();

  const { user } = useUser();

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [imageLoading, setImageLoading] = useState("nada");
  const [open, setOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

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

  useEffect(() => {
    let retrieveLocalStorage = JSON.parse(localStorage.getItem("my-cart"));

    if (retrieveLocalStorage) {
      setCart(retrieveLocalStorage);
    }
    let difference = 0;
    if (document.cookie) {
      const cookieDate = new Date(document.cookie.split("date=")[1]);
      const today = new Date();
      difference = today.getTime() - cookieDate.getTime();
      console.log(cookieDate);
    }

    setTimeout(() => {
      if (
        difference > 86400000 ||
        !document.cookie.toString().includes("date")
      ) {
        setShowMessage(true);
        document.cookie = `date=${new Date().toISOString()}`;
      } else {
        setShowMessage(false);
      }
    }, 1500);
  }, []);

  useEffect(() => {
    if (JSON.stringify(productsCart) != "[]") {
      localStorage.setItem("my-cart", JSON.stringify(productsCart));
    }
  });

  const product1 = products.find((product) => {
    return product.name === "Cama Funcional - 2 plazas";
  });

  const product2 = products.find((product) => {
    return product.name === "Cajonera Aster";
  });

  const product3 = products.find((product) => {
    return product.name === "Rack Brezo";
  });

  const product4 = products.find((product) => {
    return product.name === "Escritorio Klassic";
  });

  const product5 = products.find((product) => {
    return product.name === "Estantería Klassic";
  });

  const createCustomOrder = async (order: Custom_Order) => {
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

  return (
    <main className="w-full  text-white">
      <Message closeModal={setShowMessage} openModal={showMessage}>
        <h1 className="font-bold text-2xl mb-2">Hola!</h1>{" "}
        <p className="p-2">
          Te queremos comentar que estás usando nuestra versión{" "}
          <b className="font-semibold">BETA</b> de nuestro sitio web, podés
          presupuestar pedidos y dejarnos un pedido hecho, pero aun no se pueden
          pagar a través de nuestro sitio.
        </p>
      </Message>
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
                return supabase_images_url + img.name;
              });
            }
          };

          [...images].forEach(function (image, idx, images) {
            setImageLoading("cargando");
            supabase.storage
              .from("personalized-projects-images")
              .upload(`public/${image.name}`, image, {
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
                isProject: false,
              }).then(() => {
                notify();
              });
            }
          });
        }}
        openModal={open}
        closeModal={setOpen}
        title="Quiero un mueble personalizado"
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
              placeholder="Tu dirección"
            />
            <textarea
              id="mensaje"
              placeholder="Contanos lo que estás buscando, necesidades a cubrir, materiales, colores, medidas, etc."
              className="shadow-sm focus:shadow-md w-full my-2 py-1 px-2  focus:border-yellow-400 outline-none focus:bg-yellow-100 transition-all duration-200"
            />
            <div className="flex flex-col">
              {" "}
              <label
                className="cursor-pointer mb-1 text-gray-500"
                htmlFor="img-pedido"
              >
                ¿Tenés alguna imagen de referencia que nos quieras compartir?
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
                    <CheckBadgeIcon className="w-5"></CheckBadgeIcon>
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
      <div
        id="product-container"
        className=" bg-center bg-cover opacity-animation md:mx-20 py-8 px-4 md:px-16 rounded-md  shadow-lg"
        style={{
          backgroundImage: `url("${product1.img[0]}")`,
        }}
      >
        <div className="flex gap-4 flex-col xl:flex-row lg:my-16">
          <div
            id="container-left"
            className="flex-1 justify-items-stretch self-stretch flex flex-col text-lg  opacity-animation  text-justify  text-white font-semibold"
          >
            <p className="uppercase slide-bottom  2xl:text-4xl text-3xl text-center font-bold text-neutral-50 mb-5 drop-shadow-[2px_2px_2px_rgba(0,0,0,0.30)] xl:text-4xl lg:text-4xl  lg:text-right">
              Cama funcional de dos plazas
            </p>
            <div className="backdrop-blur-lg shadow-lg font-normal text-[.9rem] rounded-md bg-black/50  py-5 px-4 md:px-8">
              {product1.description}
            </div>
            <div
              onClick={() => {
                if (user) {
                  setOpen(true);
                } else {
                  router.push("/api/auth/login?returnTo=/");
                }
              }}
              className="cursor-pointer hover:bg-yellow-500 px-3 py-2  my-5 drop-shadow-[2px_2px_2px_rgba(0,0,0,0.30)] flex flex-col items-center rounded-md bg-yellow-300 md:self-start self-center font-normal text-sm transition-all duration-200 text-black"
            >
              Presupuesto personalizado
              {!user && (
                <span className="text-[.7rem] font-bold">Iniciar sesión</span>
              )}
            </div>

            <div className="mt-auto flex flex-col flex-wrap justify-center text-white md:justify-end gap-5 items-center md:items-end">
              <div className="px-4 py-4 rounded-md text-green-600  flex items-end gap-2 bg-white drop-shadow-[1px_1px_3px_rgba(0,0,0,0.5)]">
                <p className="md:text-4xl text-3xl font-bold  ">
                  {formatter.format(product1.base_price)}
                </p>
                <p className="text-right font-normal">Precio base</p>
              </div>
              <div className="flex gap-5">
                {" "}
                <div className=" p-3 md:text-lg text-sm border  drop-shadow-[1px_1px_1px_rgba(0,0,0,0.60)] transition-all duration-200 hover:border-yellow-500 bg-yellow-200/50 text-white hover:bg-yellow-500 rounded-md cursor-pointer  ">
                  <Link href="/products">Ver todos los productos</Link>
                </div>
                <div className=" p-3 border md:text-lg text-sm cursor-pointer border-yellow-300 transition-all duration-200 hover:bg-yellow-500  drop-shadow-[1px_1px_3px_rgba(0,0,0,0.60)]  bg-yellow-300 rounded-md hover:text-white text-black hover:border-yellow-500">
                  <Link href={`/products/${product1._id}`}>Ver detalles</Link>
                </div>
              </div>
            </div>
          </div>

          <div
            className="bg-cover backdrop-blur-lg slide-left  bg-center xl:w-[40%] h-[60vh] drop-shadow-[0px_5px_5px_rgba(0,0,0,0.250)]"
            style={{ backgroundImage: `url("${product1.img[0]}")` }}
          ></div>
        </div>
      </div>
      <ProductContainer odd={false}>
        <div className="px-8 flex flex-col gap-4">
          <h1 className="font-bold text-3xl text-left">{product2.name}</h1>{" "}
          <div className="flex flex-col sm:flex-row gap-4">
            <img
              className="sm:w-[35%] w-[70%]  object-cover object-center mx-auto sm:aspect-[4/5]"
              src={`${product2.img[0]}`}
            ></img>
            <div className="flex flex-col">
              <p>{product2.description}</p>{" "}
              <div
                onClick={() => {
                  setOpen(true);
                }}
                className="cursor-pointer self-start hover:bg-yellow-500 px-3 py-2 my-5 drop-shadow-[2px_2px_2px_rgba(0,0,0,0.30)] rounded-md bg-yellow-300 text-black font-normal text-sm transition-all duration-200"
              >
                Presupuesto personalizado
              </div>
              <div className="px-4 py-4 rounded-md text-yellow-600  flex items-end justify-center sm:self-start gap-2 bg-white drop-shadow-[1px_1px_3px_rgba(0,0,0,0.5)] mb-5">
                <p className="md:text-2xl text-xl font-bold">
                  {formatter.format(product2.base_price)}
                </p>
                <p className="text-right font-normal text-xs">Precio base</p>
              </div>
              <div className=" p-3 sm:self-end text-center mt-auto rounded-md border cursor-pointer border-yellow-300 text-black transition-all duration-200 hover:bg-yellow-500 hover:border-yellow-500 drop-shadow-[1px_1px_3px_rgba(0,0,0,0.60)] bg-yellow-300">
                <Link href={`/products/${product2._id}`}>Ver detalles</Link>
              </div>
            </div>
          </div>
        </div>
      </ProductContainer>
      <ProductContainer odd={true}>
        <div className="px-8 flex flex-col gap-4">
          <h1 className="font-bold text-3xl text-left">{product3.name}</h1>{" "}
          <div className="flex flex-col sm:flex-row gap-4">
            <img
              className="sm:w-[35%] w-[70%]  object-cover object-center mx-auto sm:aspect-[4/5]"
              src={`${product3.img[0]}`}
            ></img>
            <div className="flex flex-col">
              <p>{product3.description}</p>{" "}
              <div
                onClick={() => {
                  setOpen(true);
                }}
                className="cursor-pointer self-start hover:bg-yellow-500 px-3 py-2 my-5 drop-shadow-[2px_2px_2px_rgba(0,0,0,0.30)] rounded-md bg-yellow-300 text-black font-normal text-sm transition-all duration-200"
              >
                Presupuesto personalizado
              </div>
              <div className="px-4 py-4 rounded-md text-yellow-600  flex items-end justify-center sm:self-start gap-2 bg-white drop-shadow-[1px_1px_3px_rgba(0,0,0,0.5)] mb-5">
                <p className="md:text-2xl text-xl font-bold">
                  {formatter.format(product3.base_price)}
                </p>
                <p className="text-right font-normal text-xs">Precio base</p>
              </div>
              <div className=" p-3 sm:self-end text-center mt-auto rounded-md border cursor-pointer border-yellow-300 text-black transition-all duration-200 hover:bg-yellow-500 hover:border-yellow-500 drop-shadow-[1px_1px_3px_rgba(0,0,0,0.60)] bg-yellow-300">
                <Link href={`/products/${product3._id}`}>Ver detalles</Link>
              </div>
            </div>
          </div>
        </div>
      </ProductContainer>
      <ProductContainer odd={false}>
        {" "}
        <div className="px-8 flex flex-col gap-4">
          <h1 className="font-bold text-3xl text-left">{product4.name}</h1>{" "}
          <div className="flex flex-col sm:flex-row gap-4">
            <img
              className="sm:w-[35%] w-[70%]  object-cover object-center mx-auto sm:aspect-[4/5]"
              src={`${product4.img[0]}`}
            ></img>
            <div className="flex flex-col">
              <p>{product4.description}</p>{" "}
              <div
                onClick={() => {
                  setOpen(true);
                }}
                className="cursor-pointer self-start hover:bg-yellow-500 px-3 py-2 my-5 drop-shadow-[2px_2px_2px_rgba(0,0,0,0.30)] rounded-md bg-yellow-300 text-black font-normal text-sm transition-all duration-200"
              >
                Presupuesto personalizado
              </div>
              <div className="px-4 py-4 rounded-md text-yellow-600  flex items-end justify-center sm:self-start gap-2 bg-white drop-shadow-[1px_1px_3px_rgba(0,0,0,0.5)] mb-5">
                <p className="md:text-2xl text-xl font-bold">
                  {formatter.format(product4.base_price)}
                </p>
                <p className="text-right font-normal text-xs">Precio base</p>
              </div>
              <div className=" p-3 sm:self-end text-center mt-auto rounded-md border cursor-pointer border-yellow-300 text-black transition-all duration-200 hover:bg-yellow-500 hover:border-yellow-500 drop-shadow-[1px_1px_3px_rgba(0,0,0,0.60)] bg-yellow-300">
                <Link href={`/products/${product4._id}`}>Ver detalles</Link>
              </div>
            </div>
          </div>
        </div>
      </ProductContainer>
      <ProductContainer odd={true}>
        {" "}
        <div className="px-8 flex flex-col gap-4">
          <h1 className="font-bold text-3xl text-left">{product5.name}</h1>{" "}
          <div className="flex flex-col sm:flex-row gap-4">
            <img
              className="sm:w-[35%] w-[70%]  object-cover object-center mx-auto sm:aspect-[4/5]"
              src={`${product5.img[0]}`}
            ></img>
            <div className="flex flex-col">
              <p>{product5.description}</p>{" "}
              <div
                onClick={() => {
                  setOpen(true);
                }}
                className="cursor-pointer self-start hover:bg-yellow-500 px-3 py-2 my-5 drop-shadow-[2px_2px_2px_rgba(0,0,0,0.30)] rounded-md bg-yellow-300 text-black font-normal text-sm transition-all duration-200"
              >
                Presupuesto personalizado
              </div>
              <div className="px-4 py-4 rounded-md text-yellow-600  flex items-end justify-center sm:self-start gap-2 bg-white drop-shadow-[1px_1px_3px_rgba(0,0,0,0.5)] mb-5">
                <p className="md:text-2xl text-xl font-bold">
                  {formatter.format(product5.base_price)}
                </p>
                <p className="text-right font-normal text-xs">Precio base</p>
              </div>
              <div className=" p-3 sm:self-end text-center mt-auto rounded-md border cursor-pointer border-yellow-300 text-black transition-all duration-200 hover:bg-yellow-500 hover:border-yellow-500 drop-shadow-[1px_1px_3px_rgba(0,0,0,0.60)] bg-yellow-300">
                <Link href={`/products/${product5._id}`}>Ver detalles</Link>
              </div>
            </div>
          </div>
        </div>
      </ProductContainer>
    </main>
  );
}

export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library

  async function productsHandler() {
    const client = await clientPromise;
    const db = client.db("klass_ecommerce");
    const collection = db.collection("products");

    return await collection.find({}).toArray();
  }

  const productsResponse = await productsHandler();

  // By returning { props: { items } }, the Products component
  // will receive `items` as Link prop at build time
  return {
    props: {
      products: productsResponse.map((product) => {
        return {
          ...product,
          _id: product._id.toString(),
        };
      }),
    },
  };
}
