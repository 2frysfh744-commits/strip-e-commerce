export type Product = {
  id: number;
  slug: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  sizes: string[];
  featured: boolean;
  newArrival: boolean;
};