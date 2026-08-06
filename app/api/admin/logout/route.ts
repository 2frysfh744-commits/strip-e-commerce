import { NextResponse } from "next/server";

import { clearAdminSession } from "@/lib/adminAuth";

export async function POST(request: Request) {
  await clearAdminSession();

  return NextResponse.redirect(
    new URL("/admin/login", request.url),
    303
  );
}