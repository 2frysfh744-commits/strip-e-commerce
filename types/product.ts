export type Product = {
  id: number;
  slug: string;
  name: string;
  price: number;
  description: string;
  image: string;
  images: string[];
  category: string;
  sizes: string[];
  featured: boolean;
  newArrival: boolean;
  active?: boolean;
  inventory?: Record<string, number>;
};

export function getAvailableStock(product: Product, size: string) {
  return Math.max(0, product.inventory?.[size] ?? 0);
}

export function getTotalStock(product: Product) {
  return product.sizes.reduce(
    (total, size) => total + getAvailableStock(product, size),
    0
  );
}

export function isRemoteProductImage(image: string) {
  return image.startsWith("https://") || image.startsWith("http://");
}
