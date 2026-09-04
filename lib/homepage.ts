import "server-only";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  defaultHomepageImages,
  isHomepageImageKey,
  type HomepageImages,
} from "@/types/homepage";

type HomepageImageRow = {
  slot: string;
  image_url: string;
};

export type HomepageImageState = {
  images: HomepageImages;
  ready: boolean;
};

async function loadHomepageImageState(): Promise<HomepageImageState> {
  const images = { ...defaultHomepageImages };
  const { data, error } = await supabaseAdmin
    .from("homepage_images")
    .select("slot, image_url");

  if (error) {
    return { images, ready: false };
  }

  for (const row of (data ?? []) as HomepageImageRow[]) {
    if (isHomepageImageKey(row.slot) && row.image_url.trim()) {
      images[row.slot] = row.image_url;
    }
  }

  return { images, ready: true };
}

export async function getHomepageImages() {
  return (await loadHomepageImageState()).images;
}

export async function getAdminHomepageImageState() {
  return loadHomepageImageState();
}
