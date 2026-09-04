export const homepageImageSlots = [
  {
    key: "hero",
    label: "Main hero",
    description: "The full-screen image at the top of the homepage.",
    defaultImage: "/Hero.jpg",
  },
  {
    key: "gallery_one",
    label: "Gallery frame 1",
    description: "The large left frame in the moving photo collection.",
    defaultImage: "/home/editorial/grey-half-zip-standing.png",
  },
  {
    key: "gallery_two",
    label: "Gallery frame 2",
    description: "The upper middle frame in the moving photo collection.",
    defaultImage: "/home/editorial/brown-half-zip-standing.jpg",
  },
  {
    key: "gallery_three",
    label: "Gallery frame 3",
    description: "The upper right frame in the moving photo collection.",
    defaultImage: "/categories/women.jpg",
  },
  {
    key: "gallery_four",
    label: "Gallery frame 4",
    description: "The lower right frame in the moving photo collection.",
    defaultImage: "/home/editorial/black-half-zip-light-denim.png",
  },
  {
    key: "gallery_five",
    label: "Gallery frame 5",
    description: "The lower middle frame in the moving photo collection.",
    defaultImage: "/home/editorial/grey-half-zip-seated.png",
  },
  {
    key: "category_men",
    label: "Men category",
    description: "The image behind the MEN category link.",
    defaultImage: "/products/model/black-half-zip-cargo.png",
  },
  {
    key: "category_women",
    label: "Women category",
    description: "The image behind the WOMEN category link.",
    defaultImage: "/categories/women.jpg",
  },
] as const;

export type HomepageImageKey = (typeof homepageImageSlots)[number]["key"];
export type HomepageImages = Record<HomepageImageKey, string>;

export const defaultHomepageImages = Object.fromEntries(
  homepageImageSlots.map((slot) => [slot.key, slot.defaultImage])
) as HomepageImages;

export function isHomepageImageKey(value: string): value is HomepageImageKey {
  return homepageImageSlots.some((slot) => slot.key === value);
}

export function isRemoteImage(image: string) {
  return image.startsWith("https://") || image.startsWith("http://");
}
