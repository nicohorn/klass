import { create } from "zustand";

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
  setCart: (items: any) => {
    set((state) => {
      return {
        ...state,
        cart: [...items],
      };
    });
  },
  addToCart: (
    id: any,
    price: any,
    size: any,
    color_1: any,
    color_2: any,
    style: any,
    model: any
  ) => {
    set((state) => {
      //Función para chequear si el producto ya existe en el carrito
      const isInCart = state.cart.find(
        (product) =>
          product.id == id &&
          product.size == size &&
          product.color_1 == color_1 &&
          product.color_2 == color_2 &&
          product.style == style &&
          product.model == model
      );

      //Si el producto no existe, devuelve el carrito con el producto adentro y un count = 1;
      if (!isInCart) {
        return {
          ...state,
          cart: [
            ...state.cart,
            { id, size, color_1, color_2, style, model, price, count: 1 },
          ],
        };
      }
      //Recorre el array de productos para ver si encuentra el producto que se quiere agregar, en caso de encontrarlo, suma +1 a su count, si no, queda solo el producto.
      const updatedCart = state.cart.map((product) =>
        product.id == id &&
        product.size == size &&
        product.color_1 == color_1 &&
        product.color_2 == color_2 &&
        product.style == style &&
        product.model == model
          ? { ...product, count: product.count + 1 }
          : product
      );

      return {
        ...state,
        cart: updatedCart,
      };
    });
  },
  removeFromCart: (id, size, color_1, color_2, style, model) =>
    set((state) => {
      const isPresent = state.cart.findIndex(
        (product) =>
          product.id == id &&
          product.size == size &&
          product.color_1 == color_1 &&
          product.color_2 == color_2 &&
          product.style == style &&
          product.model == model
      );

      if (isPresent === -1) {
        return {
          ...state,
        };
      }

      const updatedCart = state.cart
        .map((product) =>
          product.id == id &&
          product.size == size &&
          product.color_1 == color_1 &&
          product.color_2 == color_2 &&
          product.style == style &&
          product.model == model
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
