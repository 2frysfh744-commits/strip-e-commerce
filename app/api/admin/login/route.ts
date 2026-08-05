import { NextResponse } from "next/server";

import {
  setAdminSession,
  validateAdminCredentials,
} from "@/lib/adminAuth";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (typeof body !== "object" || body === null) {
      return NextResponse.json(
        { error: "Invalid login information." },
        { status: 400 }
      );
    }

    const credentials = body as Record<string, unknown>;

    if (
      !isNonEmptyString(credentials.username) ||
      !isNonEmptyString(credentials.password)
    ) {
      return NextResponse.json(
        { error: "Enter your username and password." },
        { status: 400 }
      );
    }

    const isValid = validateAdminCredentials(
      credentials.username.trim(),
      credentials.password
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Incorrect username or password." },
        { status: 401 }
      );
    }

    await setAdminSession();

    return NextResponse.json({
      message: "Login successful.",
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      { error: "Unable to log in right now." },
      { status: 500 }
    );
  }
}