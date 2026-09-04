import Categories from "@/components/home/Categories";
import Hero from "@/components/home/Hero";
import NewArrivals from "@/components/home/NewArrivals";
import ScatteredGallery from "@/components/home/ScatteredGallery";
import { getHomepageImages } from "@/lib/homepage";

export const dynamic = "force-dynamic";

export default async function Home() {
  const images = await getHomepageImages();

  return (
    <main>
      <Hero image={images.hero} />
      <ScatteredGallery
        images={[
          images.gallery_one,
          images.gallery_two,
          images.gallery_three,
          images.gallery_four,
          images.gallery_five,
        ]}
      />
      <Categories
        menImage={images.category_men}
        womenImage={images.category_women}
      />
      <NewArrivals />
    </main>
  );
}
