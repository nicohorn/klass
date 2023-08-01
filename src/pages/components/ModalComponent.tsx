import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

export default function ModalComponent(props) {
  return (
    <>
      <Transition appear show={props.isOpen || false} as={Fragment}>
        <Dialog as="div" className="relative z-[99]" onClose={props.closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className=" fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-auto">
            <div className="flex items-center justify-center p-4 text-center ">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full transform bg-[#FFFFF9] p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-medium leading-6 text-gray-900 mb-5"
                  >
                    {props.title}
                  </Dialog.Title>
                  <div className="mt-2">{props.children}</div>

                  <div className="mt-4 flex gap-2 justify-between">
                    <button
                      type="button"
                      className=" border border-transparent justify-end bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 "
                      onClick={props.closeModal}
                    >
                      Cerrar
                    </button>
                    <button
                      type="button"
                      className=" border border-transparent justify-end bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 "
                      onClick={props.buttonFunction}
                    >
                      {!props.loading ? props.buttonTitle : "Cargando..."}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
