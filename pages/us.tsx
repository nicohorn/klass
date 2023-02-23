import React from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { json } from "stream/consumers";

export default function Us() {
  const { user, error, isLoading } = useUser();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  return (
    <main className="bg-[url('/images/gardenia.jpg')] min-h-[85vh] py-10  bg-cover bg-center lg:bg-[center_top_-20rem] bg-no-repeat flex flex-col justify-center">
      <div className="text-center font-bold xl:text-5xl lg:text-3xl text-xl">
        Nosotros
      </div>
      <div className="text-black mx-5   xl:w-[40%] xl:mx-auto md:text-justify md:p-10 p-4 flex flex-col gap-6 lg:shadow-md mt-5 bg-white/60 backdrop-blur-sm rounded-md ">
        <p>
          Nuestra guía es el diseño, el resultado son <b>muebles asequibles.</b>{" "}
          Con la mirada puesta en la vida diaria del hogar, tomamos decisiones
          sobre la estética, los materiales, los procesos internos y los que
          tercerizamos, para lograr{" "}
          <b>
            piezas que hagan de nuestro espacio cotidiano un lugar más cómodo y
            bello.
          </b>{" "}
        </p>
        <p>
          Entendiendo que lo único constante es el cambio, nuestra idea de
          negocio se basa en que{" "}
          <b>
            los objetos puedan cumplir el ciclo necesario en la vida de cada
            cliente
          </b>
          , con la calidad adecuada para que dure, y el precio indicado para
          poder renovarlo cuando se desee cambiar el estilo del lugar.
        </p>
        <p>
          Nacimos en la ciudad de Rosario hace más de 4 años y ahora estamos
          llegando a Crespo.
        </p>
        <div>
          <p className="font-bold text-2xl">Información de contacto</p>
          <div className="sm:text-lg text-sm text-center sm:text-left">
            <div className="flex sm:flex-row flex-col flex-wrap gap-2 mt-3  bg-white/60 px-5 p-2 items-center  rounded-md shadow-sm">
              <p>Email:</p>
              <a href="mailto:contacto.klass@gmail.com">
                <p className="font-semibold hover:text-gray-700">
                  contacto.klass@gmail.com
                </p>
              </a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 sm:ml-auto"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </div>
            <div className="flex sm:flex-row flex-col flex-wrap gap-2 mt-3 bg-white/60 px-5 p-2 items-center  rounded-md shadow-sm">
              <p>Fábrica:</p>
              <a href="https://goo.gl/maps/2FtsgEF26J1z1FJj8">
                <p className="font-semibold hover:text-gray-700">
                  Francisco Sagemuller n°590, Parque Industrial , Crespo, ER
                </p>
              </a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 sm:ml-auto"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
                />
              </svg>
            </div>
            <div className="flex sm:flex-row flex-col flex-wrap gap-2 mt-3 bg-white/60 px-5 p-2 items-center  rounded-md shadow-sm">
              <p>Local comercial: </p>
              <a href="https://goo.gl/maps/AktyAXMrSyGFWBJY6">
                <p className="font-semibold hover:text-gray-700">
                  Otto Sagemuller y Estrada, Crespo, ER
                </p>
              </a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 sm:ml-auto"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
