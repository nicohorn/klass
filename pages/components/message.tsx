import React, { useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import gsap from "gsap";
import { toast, ToastContainer } from "react-toastify";

export default function Message(props) {
  const messageBanner = () => {
    toast.info(
      "¡Fabricamos a medida! tu mueble va a estar listo 25 días después de la recepción de la seña.",
      {
        position: "bottom-right",
        autoClose: 7500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }
    );
  };
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

        <div className="fixed md:w-96 md:mx-auto inset-0 md:px-0 px-4">
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
              <Dialog.Panel className=" transform rounded-sm bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-medium leading-6 text-black"
                >
                  {props.title}
                </Dialog.Title>
                {props.children}

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      props.closeModal(false);
                      messageBanner();
                    }}
                    type="button"
                    className=" border  hover:border-yellow-800 bg-yellow-700 border-yellow-700 border-transparent  text-white px-4 py-1 text-sm font-medium hover:text-white hover:bg-yellow-800 transition-all duration-200 focus:outline-none flex-[0.25] "
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
                      "Entendido!"
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
