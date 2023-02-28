import React from "react";

export default function Footer() {
  return (
    <footer className="md:mx-20 mx-8  bg-primary -z-50">
      <div className="text-white py-10 text-sm">
        <div className=" border-b pb-2">
          <p className="font-bold">Información de contacto</p>
          <p>Email: contacto.klass@gmail.com</p>
          <p>Local comercial: Otto Sagemuller y Estrada, Crespo, ER</p>
        </div>
        <h1 className="text-xs my-2">Todos los derechos reservados - 2023</h1>
        <img className="w-20" src="/logos-03.png"></img>
        <p className=" text-sm mt-2">
          Webapp desarrollada por{" "}
          <a className="font-bold hover:text-white/80" href="https://pqlub.com">
            PQlub
          </a>
        </p>
      </div>
    </footer>
  );
}
