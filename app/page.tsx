import Categories from "@/components/home/Categories";
import Hero from "@/components/home/Hero";
import NewArrivals from "@/components/home/NewArrivals";
import ScatteredGallery from "@/components/home/ScatteredGallery";

export default function Home() {
  return (
    <main>
      <Hero />
      <ScatteredGallery />
      <Categories />
      <NewArrivals />
    </main>
  );
}
