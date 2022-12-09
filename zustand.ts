import create from "zustand";

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
    console.log("Set Cart", items);
  },
  addToCart: (id: any, price: any, option: any) => {
    set((state) => {
      //Función para chequear si el producto ya existe en el carrito
      const isInCart = state.cart.find(
        (product) => product.id == id && product.option == option
      );

      //Si el producto no existe, devuelve el carrito con el producto adentro y un count = 1;
      console.log("addToCart", state.cart);
      if (!isInCart) {
        //console.log("Console log desde useProducts", ...state);
        return {
          ...state,
          cart: [...state.cart, { id, option, price, count: 1 }],
        };
      }
      //Recorre el array de productos para ver si encuentra el producto que se quiere agregar, en caso de encontrarlo, suma +1 a su count, si no, queda solo el producto.
      const updatedCart = state.cart.map((product) =>
        product.id === id && product.option == option
          ? { ...product, count: product.count + 1 }
          : product
      );

      return {
        ...state,
        cart: updatedCart,
      };
    });
  },
  removeFromCart: (id, option) =>
    set((state) => {
      const isPresent = state.cart.findIndex(
        (product) => product.id === id && product.option == option
      );

      if (isPresent === -1) {
        return {
          ...state,
        };
      }

      const updatedCart = state.cart
        .map((product) =>
          product.id === id && product.option == option
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
