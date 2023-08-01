import React, { useState, useEffect } from "react";
import { Disclosure, Transition } from "@headlessui/react";

export default function MultipleSelector({
  items,
  label,
  hasMultiplier,
  setOptions,
  show,
}: {
  items: any;
  label: string;
  hasMultiplier: boolean;
  setOptions: Function;
  show: boolean;
}) {
  const [selectedItems, setSelectedItems] = useState([]);
  const multiplier = 1;

  const [active, setActive] = useState(show);

  useEffect(() => {
    setOptions(selectedItems);
  });

  return (
    <>
      <Disclosure defaultOpen={active}>
        <Disclosure.Button className="text-left">
          <label
            onClick={() => {
              setActive(!active);
            }}
            className={`flex gap-2 border-b pb-1 text-[.85rem] font-bold hover:cursor-pointer hover:text-yellow-500 ${
              active ? "text-yellow-500" : null
            }`}
          >
            {
              <p
                className={`transition-all duration-300 font-bold text-white  ${
                  active ? " rotate-180 opacity-100" : "rotate-90 "
                }`}
              >
                ^
              </p>
            }
            {label}
          </label>
        </Disclosure.Button>

        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Disclosure.Panel>
            <div className={`flex gap-3 text-sm flex-wrap`}>
              {items &&
                items.map((item, i) => {
                  return (
                    <div
                      className={`relative transition-all duration-150 border px-2 py-1 cursor-pointer hover:border-yellow-500 ${
                        selectedItems.find((e) => e._id === item._id)
                          ? " border-yellow-600 text-yellow-500 "
                          : null
                      }`}
                      key={item._id}
                    >
                      <span
                        className="text-xs "
                        onClick={() => {
                          if (!selectedItems.find((e) => e._id === item._id)) {
                            setSelectedItems([
                              ...selectedItems,
                              { ...item, value: item.name, multiplier },
                            ]);
                          } else if (
                            selectedItems.find((e) => e._id === item._id)
                          ) {
                            setSelectedItems(
                              selectedItems.filter((e) => e._id !== item._id)
                            );
                          }
                        }}
                      >
                        {item.name}
                      </span>
                      <p className="absolute -top-2 -left-[.3rem] bg-yellow-500 w-4 text-center rounded-full text-xs text-black">
                        {selectedItems.indexOf(
                          selectedItems.find((e) => {
                            return e._id === item._id;
                          })
                        ) +
                          1 >=
                        1
                          ? selectedItems.indexOf(
                              selectedItems.find((e) => {
                                return e._id === item._id;
                              })
                            ) + 1
                          : null}
                      </p>
                      {hasMultiplier ? (
                        <input
                          className={`${
                            !selectedItems.find((e) => e._id === item._id)
                              ? "w-0"
                              : "w-6"
                          } bg-primary text-center outline-none ml-2 text-xs border-b-white border-b transition-all duration-150 `}
                          type="number"
                          id={`multiplier${item._id}`}
                          onChange={() => {
                            const m = (
                              document.getElementById(
                                `multiplier${item._id}`
                              ) as HTMLInputElement
                            ).value;

                            const indexOfItemToUpdate = selectedItems.indexOf(
                              selectedItems.find((e) => {
                                return e._id === item._id;
                              })
                            );

                            if (m)
                              selectedItems[indexOfItemToUpdate].multiplier =
                                parseFloat(m);
                            else
                              selectedItems[indexOfItemToUpdate].multiplier = 1;

                            setSelectedItems([...selectedItems]);
                          }}
                        />
                      ) : null}
                    </div>
                  );
                })}
            </div>
          </Disclosure.Panel>
        </Transition>
      </Disclosure>
    </>
  );
}
