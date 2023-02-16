import React from "react";

export default function ImageContainer(props) {
  return (
    <>
      <img
        id="productImage"
        key={props.imageIndex}
        className="h-full object-cover transition-all duration-200 object-center rounded-sm drop-shadow-[5px_5px_5px_rgba(0,0,0,0.20)]"
        src={`${props.img[props.imageIndex]}`}
        style={{ opacity: "0" }} // Set initial opacity to 0
        onLoad={(e) => {
          const img = e.target as HTMLImageElement; // Use type assertion to cast to HTMLImageElement
          img.style.opacity = "1"; // Set opacity to 1 after image is loaded
        }}
      ></img>

      <div
        onClick={() => {
          props.img.length - 1 === props.imageIndex
            ? props.setImageIndex(0)
            : props.setImageIndex(props.imageIndex + 1);
        }}
        className="heartbeat absolute transition-all duration-150 p-3 cursor-pointer active:scale-95 hover:scale-105 group-hover:opacity-100 opacity-30 rounded hover:bg-neutral-900 bg-neutral-900/70 text-white top-[45%] sm:right-5 right-2 "
      >
        {">"}
      </div>
      <div
        onClick={() => {
          props.imageIndex === 0
            ? props.setImageIndex(props.img.length - 1)
            : props.setImageIndex(props.imageIndex - 1);
        }}
        className="heartbeat absolute transition-all duration-150 cursor-pointer p-3 active:scale-95 hover:scale-105 group-hover:opacity-100 opacity-30 rounded hover:bg-neutral-900 bg-neutral-900/70 text-white top-[45%] sm:left-5 left-2"
      >
        {"<"}
      </div>
    </>
  );
}
