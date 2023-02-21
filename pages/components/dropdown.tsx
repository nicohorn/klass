import React, { useState, useEffect } from "react";
import gsap from "gsap";
import Link from "next/link";
import { useDropdown } from "../../zustand";

export default function Dropdown(props) {
  const dropdownState = useDropdown((state: any) => state.dropdownState);
  const changeState = useDropdown((state: any) => state.changeState);

  useEffect(() => {
    if (dropdownState) {
      gsap.to("#menu", {
        y: 0,
        opacity: 1,
        duration: 0.15,
        display: "block",
      });
    } else {
      gsap.to("#menu", {
        opacity: 0,
        y: -20,

        duration: 0.1,
        onComplete: () => {
          gsap.to("#menu", { display: "none" });
        },
      });
    }
  }, [dropdownState]);

  return (
    <div className="relative">
      <button onClick={() => changeState()} className=" bg-primary text-white">
        <svg
          id="profile-icon"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={
            dropdownState
              ? "w-8 h-8 absolute opacity-0 rotate-180 transition-all duration-500"
              : "w-8 h-8 absolute transition-all duration-500"
          }
        >
          <title>Mi cuenta</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>

        <svg
          id="close-icon"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={
            dropdownState
              ? "w-8 h-8 transition-all duration-500"
              : "w-8 h-8  opacity-0 -rotate-180 transition-all duration-500"
          }
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      <div
        id="menu"
        className="absolute p-2 rounded-sm font-semibold w-40 mt-4 opacity-0 bg-neutral-100 right-0 transition-all duration-200 z-50 drop-shadow-md text-sm"
      >
        <div className=" w-4 h-4 rotate-45 absolute -translate-y-4 translate-x-32 bg-neutral-100"></div>
        {props.options?.map((option, i) => {
          return (
            <div className="cursor-pointer" key={i}>
              <Link href={option.href}>
                <div className=" p-2 rounded-md border bg-white border-white shadow-sm  my-2 hover:border-gray-400 transition-all duration-150 flex justify-between h-full">
                  <span>{option.title}</span>
                  <span>{option.icon}</span>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
