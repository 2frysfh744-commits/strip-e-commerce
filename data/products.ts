import { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: 1,
    slug: "black-sweater",
    name: "Black Sweater",
    price: 249,
    description: "Minimal oversized half-zip sweater.",
    image: "/products/black without background.png",
    category: "Sweaters",
    sizes: ["S", "M", "L", "XL"],
    featured: true,
    newArrival: true,
  },

  {
    id: 2,
    slug: "brown-sweater",
    name: "Brown Sweater",
    price: 249,
    description: "Relaxed fit brown half-zip sweater.",
    image: "/products/brown without background.png",
    category: "Sweaters",
    sizes: ["S", "M", "L", "XL"],
    featured: true,
    newArrival: true,
  },

  {
    id: 3,
    slug: "cargo-pants",
    name: "Cargo Pants",
    price: 299,
    description: "Wide-leg beige cargo pants.",
    image: "/products/cargo without background.png",
    category: "Pants",
    sizes: ["38", "40", "42", "44"],
    featured: true,
    newArrival: false,
  },

  {
    id: 4,
    slug: "dark-blue-jeans",
    name: "Dark Blue Jeans",
    price: 329,
    description: "Classic straight-fit dark blue jeans.",
    image: "/products/dark blue jean without background.png",
    category: "Jeans",
    sizes: ["38", "40", "42", "44"],
    featured: false,
    newArrival: true,
  },
];