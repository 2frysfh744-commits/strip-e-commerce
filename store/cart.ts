import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { getAvailableStock, type Product } from "@/types/product";

export type CartItem = Product & {
  quantity: number;
  selectedSize: string;
};

type CartStore = {
  items: CartItem[];
  addItem: (product: Product, size: string, quantity: number) => void;
  removeItem: (id: number, size: string) => void;
  clearCart: () => void;
};

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (product, size, quantity) =>
        set((state) => {
          const availableStock = Math.min(10, getAvailableStock(product, size));

          if (availableStock < 1) {
            return state;
          }

          const safeQuantity = Math.min(
            availableStock,
            Math.max(1, Math.floor(quantity))
          );
          const existingItem = state.items.find(
            (item) => item.id === product.id && item.selectedSize === size
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id && item.selectedSize === size
                  ? {
                      ...item,
                      ...product,
                      quantity: Math.min(
                        availableStock,
                        item.quantity + safeQuantity
                      ),
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
                selectedSize: size,
                quantity: safeQuantity,
              },
            ],
          };
        }),

      removeItem: (id, size) =>
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.id === id && item.selectedSize === size)
          ),
        })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "strip-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      skipHydration: true,
    }
  )
);
