import ProductCard from "@/components/shop/ProductCard";

const products = [
  {
    name: "black sweater",
    price: 24,
    image: "/products/black without background.png",
  },
  {
    name: "brown sweater",
    price: 55,
    image: "/products/brown without background.png",
  },
  {
    name: "beige Cargo Pants",
    price: 49,
    image: "/products/cargo without background.png",
  },
  {
    name: "dark blue jean",
    price: 32,
    image: "/products/dark blue jean without background.png",
  },
];

export default function NewArrivals() {
  return (
    <section className="bg-black text-white py-24 px-10">
      <h2 className="text-3xl tracking-[0.2em] uppercase mb-12">
        New Arrivals
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.name} {...product} />
        ))}
      </div>
    </section>
  );
}