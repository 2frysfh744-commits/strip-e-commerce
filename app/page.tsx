import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import NewArrivals from "@/components/home/NewArrivals";
import Categories from "@/components/home/Categories";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Categories />
      <NewArrivals />
    </>
  );
}