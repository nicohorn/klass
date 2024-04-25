import { useEditor } from "@tiptap/react";
import React, { useEffect, useState } from "react";

export default function Adder({
  selectedOptions,
  setOptions,
  label,
  inputValueId,
  inputMultiplierId,
  inputValuePlaceholder,
  inputMultiplierPlaceholder,
  inputValueLabel,
  inputMultiplierLabel,
  uppercase,
}: {
  selectedOptions: { value: string; multiplier: number }[];
  setOptions: Function;
  label: string;
  inputValueId: string;
  inputMultiplierId: string;
  inputValuePlaceholder: string;
  inputMultiplierPlaceholder: string;
  inputValueLabel: string;
  inputMultiplierLabel: string;
  uppercase: boolean;
}) {
  return (
    <div className="mb-2">
      <label className="text-[.8rem] pb-2" htmlFor={label}>
        {label}
      </label>
      <span className="flex gap-2">
        <div className="flex flex-col">
          <label className="text-[.7rem] mt-1" htmlFor={inputValueId}>
            {inputValueLabel}
          </label>
          <input
            id={inputValueId}
            type="text"
            placeholder={inputValuePlaceholder}
            className={`text-center bg-primary outline-none text-sm font-semibold focus:border-b-yellow-500 p-1 border-b-white border-b transition-all duration-150 mt-1 ${
              uppercase ? "uppercase" : null
            }`}
          ></input>
        </div>
        <div className="flex flex-col">
          <label className="text-[.7rem]  mt-1" htmlFor={inputMultiplierId}>
            {inputMultiplierLabel}
          </label>
          <input
            id={inputMultiplierId}
            type="number"
            step="any"
            placeholder={inputMultiplierPlaceholder}
            className="text-sm text-center bg-primary outline-none font-semibold focus:border-b-yellow-500 p-1 border-b-white border-b transition-all duration-150 mt-1"
          ></input>
        </div>
        <div className="flex flex-col flex-grow">
          <label className="text-[.7rem] opacity-0" htmlFor={inputMultiplierId}>
            button
          </label>
          <button
            onClick={(e) => {
              e.preventDefault();
              const value: string = uppercase
                ? (
                    document.getElementById(inputValueId) as HTMLInputElement
                  ).value.toUpperCase()
                : (document.getElementById(inputValueId) as HTMLInputElement)
                    .value;
              const multiplier: string = (
                document.getElementById(inputMultiplierId) as HTMLInputElement
              ).value;

              if (
                value &&
                multiplier &&
                !selectedOptions?.find((a) => {
                  return a.value === value;
                })
              )
                setOptions([
                  ...selectedOptions,
                  { value: value, multiplier: multiplier },
                ]);
              (
                document.getElementById(inputValueId) as HTMLInputElement
              ).value = "";
              (
                document.getElementById(inputMultiplierId) as HTMLInputElement
              ).value = "";
            }}
            className=" flex-grow items-end px-2 border font-bold hover:border-yellow-500 transition-all duration-150 active:scale-95"
          >
            +
          </button>
        </div>
      </span>
      <div className="flex gap-2 py-2">
        {selectedOptions &&
          selectedOptions.map((option, i) => {
            return (
              <span
                title="Click para eliminar"
                className={`border uppercase px-2 text-xs opacity-100 flex items-center cursor-pointer transition-all group duration-150 opacity-animation `}
                key={i}
                onClick={() => {
                  setOptions(
                    selectedOptions.filter((a) => {
                      return option.value !== a.value;
                    })
                  );
                }}
              >
                <p className="group">{option.value}</p>
                <p className="text-[.6rem] font-bold group-hover:opacity-100 group-hover:w-auto w-0 group-hover:ml-3 opacity-0 transition-all duration-150 ml-0">
                  {option.multiplier}
                </p>
              </span>
            );
          })}
      </div>
    </div>
  );
}
