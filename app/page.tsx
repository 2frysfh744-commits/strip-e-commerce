import Categories from "@/components/home/Categories";
import Hero from "@/components/home/Hero";
import NewArrivals from "@/components/home/NewArrivals";
import ScrollLookbook from "@/components/home/ScrollLookbook";

export default function Home() {
  return (
    <main>
      <Hero />
      <ScrollLookbook />
      <Categories />
      <NewArrivals />
    </main>
  );
}
