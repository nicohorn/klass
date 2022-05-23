import React from "react";

const items = [
  { img: "bg-img1", productName: "Box funcional", id: 1 },
  { img: "bg-img2", productName: "Mesita de luz flotante", id: 2 },
  { img: "bg-img3", productName: "Mesita de luz Zinnia", id: 3 },
  { img: "bg-img4", productName: "Respaldar de madera", id: 4 },
  { img: "bg-img5", productName: "Respaldar PLUS", id: 5 },
];

export default function products() {
  return (
    <div className="w-full">
      <div className="flex">
        {items.map((item) => (
          <div
            className={`flex-[0.5] bg-cover bg-center bg-no-repeat ${item.img} h-[87vh] hover:flex-[2] transition-all duration-300 group grid hover:p-20`}
          >
            <a href={`/products/` + item.id}>
              <div className="group-hover:opacity-100 opacity-0 text-4xl font-bold transition-all duration-200">
                <p className="bg-black text-white bg-opacity-40 drop-shadow p-5">
                  {item.productName}
                </p>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
