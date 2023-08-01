/* eslint-disable @next/next/no-img-element */
import React, { Fragment } from "react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import { Listbox, Transition } from "@headlessui/react";
import type { ColorOptionType, OptionType } from "src/utils/types";

/**Dropdown menu that contains the options for one of the set of options (size, color 1, color 2, etc) */
export default function OptionsListbox({
  title,
  selectedOption,
  setSelectedOption,
  options,
  colors,
}: {
  title: string;
  selectedOption: OptionType;
  setSelectedOption: React.Dispatch<OptionType>;
  options: OptionType[];
  colors?: ColorOptionType[];
}) {
  return (
    <>
      {!selectedOption || selectedOption.value == "none" ? null : (
        <div className="">
          <p className="italic text-sm">{title}</p>
          <Listbox value={selectedOption} onChange={setSelectedOption}>
            <div className="relative mt-1 flex-auto">
              <Listbox.Button className="relative w-full cursor-default  bg-yellow-50 py-2 pl-3 pr-10 text-left shadow focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="block truncate">
                  {selectedOption && selectedOption.value}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 z-50 max-h-60 bg-yellow-50 w-full overflow-auto  py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {options &&
                    options.map((option, i) => (
                      <Listbox.Option
                        key={i}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-yellow-300 text-amber-900"
                              : "text-gray-900"
                          }`
                        }
                        value={option}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              <div className="flex justify-between mr-2 items-center">
                                <span>{option.value}</span>
                                {colors ? (
                                  <img
                                    alt="product image"
                                    className="w-10 drop-shadow-lg"
                                    src={`${
                                      colors.find(
                                        (color) => option.value === color.name
                                      )?.img
                                    }`}
                                  />
                                ) : null}
                              </div>
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-yellow-600">
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      )}
    </>
  );
}
