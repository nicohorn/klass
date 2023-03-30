import React, { useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import gsap from "gsap";

export default function Modal(props) {
  useEffect(() => {
    gsap.fromTo("#loading-icon", { rotate: 0 }, { rotate: 180, repeat: -1 });
  });
  return (
    <Transition appear show={props.openModal || false} as={Fragment}>
      <Dialog
        as="div"
        onClose={() => {
          props.closeModal(false);
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed z-50 2xl:mx-[35rem] xl:mx-[20rem] lg:mx-40 sm:mx-8 inset-0">
          <div className="flex min-h-full  items-center justify-center text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className=" transform rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-medium leading-6 text-black"
                >
                  {props.title}
                </Dialog.Title>
                {props.children}

                <div className="mt-4 flex justify-between">
                  <button
                    type="button"
                    className="inline-flex justify-center border hover:border-red-800 border-red-400 border-transparent  text-red-400 bg-white px-4 py-1 text-sm font-medium hover:text-white hover:bg-red-800 transition-all duration-200 focus:outline-none items-center"
                    onClick={() => {
                      props.closeModal(false);
                      props.imageLoadingState("nada");
                    }}
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={props.buttonFunction}
                    type="button"
                    className=" border hover:border-yellow-800 bg-yellow-700 border-yellow-700 border-transparent  text-white px-4 py-1 text-sm font-medium hover:text-white hover:bg-yellow-800 transition-all duration-200 focus:outline-none flex-[0.25]  items-center flex justify-center"
                  >
                    {props.loading ? (
                      <svg
                        id="loading-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.2}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                        />
                      </svg>
                    ) : (
                      "Solicitar presupuesto"
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
