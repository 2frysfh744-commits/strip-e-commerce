import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import NewArrivals from "@/components/home/NewArrivals";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <NewArrivals />
    </>
  );
}