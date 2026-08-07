import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const imageExtensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body: unknown = await request.json();

    if (typeof body !== "object" || body === null) {
      return NextResponse.json(
        { error: "Invalid image information." },
        { status: 400 }
      );
    }

    const { contentType, size } = body as {
      contentType?: unknown;
      size?: unknown;
    };
    const extension =
      typeof contentType === "string" ? imageExtensions[contentType] : undefined;

    if (!extension) {
      return NextResponse.json(
        { error: "Use a JPG, PNG, or WebP image." },
        { status: 400 }
      );
    }

    if (
      typeof size !== "number" ||
      !Number.isFinite(size) ||
      size < 1 ||
      size > 6 * 1024 * 1024
    ) {
      return NextResponse.json(
        { error: "Each product photo must be 6 MB or smaller." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !publishableKey) {
      throw new Error("Missing Supabase upload configuration.");
    }

    const path = `products/${Date.now()}-${randomUUID()}.${extension}`;
    const { data, error } = await supabaseAdmin.storage
      .from("product-images")
      .createSignedUploadUrl(path);

    if (error || !data) {
      console.error("Unable to sign product image upload:", error);
      return NextResponse.json(
        { error: "The image upload could not be prepared." },
        { status: 500 }
      );
    }

    const { data: publicData } = supabaseAdmin.storage
      .from("product-images")
      .getPublicUrl(path);

    return NextResponse.json({
      bucket: "product-images",
      path,
      token: data.token,
      publicUrl: publicData.publicUrl,
      supabaseUrl,
      publishableKey,
    });
  } catch (error) {
    console.error("Product image signing route error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while preparing the image." },
      { status: 500 }
    );
  }
}
