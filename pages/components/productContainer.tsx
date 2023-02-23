import React from "react";
import { useInView } from "react-intersection-observer";

export default function ProductContainer(props) {
  const { ref, inView, entry } = useInView({
    threshold: 0,
  });
  console.log(inView);
  return (
    <div
      className={`md:mx-20 flex transition-all duration-200 ${
        props.odd ? "justify-end" : "justify-start"
      } rounded-sm  md:mt-20 mt-5 ${
        props.odd && inView ? "slide-left" : null
      } ${!props.odd && inView ? "slide-right" : null} ${
        inView ? "opacity-100" : "opacity-out"
      } transition-all duration-200`}
    >
      <div ref={ref} className="bg-black xl:w-2/3 py-10 text-white">
        {props.children}
      </div>
    </div>
  );
}
