import { create } from "zustand";
import { Product } from "@/types/product";

type CartItem = Product & {
  quantity: number;
  selectedSize: string;
};

type CartStore = {
  items: CartItem[];

  addItem: (
    product: Product,
    size: string,
    quantity: number
  ) => void;

  removeItem: (id: number, size: string) => void;

  clearCart: () => void;
};

export const useCart = create<CartStore>((set) => ({
  items: [],

  addItem: (product, size, quantity) =>
    set((state) => {
      const existing = state.items.find(
        (item) =>
          item.id === product.id &&
          item.selectedSize === size
      );

      if (existing) {
        return {
          items: state.items.map((item) =>
            item.id === product.id &&
            item.selectedSize === size
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                }
              : item
          ),
        };
      }

      return {
        items: [
          ...state.items,
          {
            ...product,
            quantity,
            selectedSize: size,
          },
        ],
      };
    }),

  removeItem: (id, size) =>
    set((state) => ({
      items: state.items.filter(
        (item) =>
          !(item.id === id && item.selectedSize === size)
      ),
    })),

  clearCart: () =>
    set({
      items: [],
    }),
}));