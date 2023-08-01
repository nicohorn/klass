import { create } from "zustand";
import type { ProductType, CartItemType } from "./types";

/** The objectsComparator function checks if the two objects have the same keys and if their corresponding values are equal. It can be used to compare item and productWithoutCount, which will now correctly return true if their contents are the same (I was trying to compare them directly but this cannot be done since JavaScript compares objects by reference and not by their content) */
function objectsComparator(obj1: Object, obj2: Object): boolean {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}

export const useProducts = create((set) => ({
  //Zustand is a state management solution. I've used it in order to make the cart available throughout all components of the page.
  cart: [],
  deleteCart: () => {
    set((state) => {
      return {
        ...state,
        cart: [],
      };
    });
  },
  setCart: (items: ProductType[]) => {
    set((state) => {
      return {
        ...state,
        cart: [...items],
      };
    });
  },
  addToCart: (item: CartItemType) => {
    set((state) => {
      //Función para chequear si el producto ya existe en el carrito (por id, size, color, style y model).
      const isInCart = state.cart.find((product) => {
        const { count, ...prdouctWithoutCount } = product;
        return objectsComparator(item, prdouctWithoutCount);
      });

      console.log(item);

      //Si el producto no existe, devuelve el carrito con el producto adentro y un count = 1;
      if (!isInCart) {
        return {
          ...state,
          cart: [...state.cart, { ...item, count: 1 }],
        };
      }
      //Recorre el array de productos para ver si encuentra el producto que se quiere agregar, en caso de encontrarlo, suma +1 a su count, si no, queda solo el producto.
      const updatedCart = state.cart.map((product) =>
        item ? { ...product, count: product.count + 1 } : product
      );

      return {
        ...state,
        cart: updatedCart,
      };
    });
  },
  removeFromCart: (item: CartItemType) =>
    set((state) => {
      const isPresent = state.cart.findIndex((product) => {
        const { count, ...productWithoutCount } = product;
        return (
          product.id == item.id &&
          product.size == item.size &&
          product.color_1 == item.color_1 &&
          product.color_2 == item.color_2 &&
          product.style == item.style &&
          product.model == item.model
        );
      });

      if (isPresent === -1) {
        return {
          ...state,
        };
      }

      const updatedCart = state.cart
        .map((product) =>
          product.id == item.id &&
          product.size == item.size &&
          product.color_1 == item.color_1 &&
          product.color_2 == item.color_2 &&
          product.style == item.style &&
          product.model == item.model
            ? { ...product, count: Math.max(product.count - 1, 0) }
            : product
        )
        .filter((product) => product.count);

      return {
        ...state,
        cart: updatedCart,
      };
    }),
}));

export const useDropdown = create((set) => ({
  dropdownState: false,

  changeState: () => set((state) => ({ dropdownState: !state.dropdownState })),
}));

export default useProducts;
