"use client";

import { useEffect } from "react";

import { useCart } from "@/store/cart";

export default function CartHydration() {
  useEffect(() => {
    useCart.persist.rehydrate();
  }, []);

  return null;
}