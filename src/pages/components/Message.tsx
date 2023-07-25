import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { toast } from "react-toastify";

export default function Message({
  title,
  bannerMessage,
  closeModal,
  openModal,
  content,
}: {
  title: string;
  bannerMessage?: string;
  closeModal: React.Dispatch<React.SetStateAction<boolean>>;
  openModal: boolean;
  content: React.ReactNode;
}) {
  const messageBanner = () => {
    toast.warning(bannerMessage, {
      position: "bottom-right",
      autoClose: 7500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      icon: false,
      theme: "light",
    });
  };

  return (
    <Transition appear show={openModal || false} as={Fragment}>
      <Dialog
        as="div"
        onClose={() => {
          closeModal(false);
          if (bannerMessage) messageBanner();
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
              <Dialog.Panel className=" transform rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-medium leading-6 text-black"
                >
                  <h1 className="font-bold text-2xl mb-2">{title}</h1>{" "}
                </Dialog.Title>
                {content}

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      closeModal(false);
                      messageBanner();
                    }}
                    type="button"
                    className=" border  hover:border-yellow-500 bg-yellow-300 border-yellow-300 border-transparent  text-black rounded-md px-4 py-1 text-sm font-medium hover:text-black hover:bg-yellow-500 transition-all duration-200 focus:outline-none flex-[0.25] "
                  >
                    Entendido!
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
