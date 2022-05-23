import React, { useState } from "react";

export default function faq(props) {
  const falseStyle =
    "opacity-0 transition-all duration-300 transition-height duration-500 break-words max-h-0 pointer-events-none";
  const trueStyle =
    "opacity-1 transition-all duration-300 break-words max-h-72 transition-height duration-500";
  const tStyle = "border border-slate-400 p-2 transition-all duration-200";
  const fStyle =
    "border p-2 transition-all duration-200 hover:border-slate-400";

  const [show, setShow] = useState(false);

  return (
    <div>
      <a className="cursor-pointer" onClick={() => setShow(!show)}>
        <div className={show || props.s ? tStyle : fStyle}>
          <div
            className={
              show || props.s
                ? "text-xl transition-all duration-200 font-bold"
                : "transition-all duration-200"
            }
          >
            ¿{props.q}?
          </div>

          <div className={show || props.s ? trueStyle : falseStyle}>
            {props.a}
          </div>
        </div>
      </a>
    </div>
  );
}
