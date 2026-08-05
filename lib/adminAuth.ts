import "server-only";

import {
  createHash,
  createHmac,
  timingSafeEqual,
} from "node:crypto";
import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "strip_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

function getAdminConfig() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!username || !password || !sessionSecret) {
    throw new Error(
      "Missing admin credentials in .env.local"
    );
  }

  return {
    username,
    password,
    sessionSecret,
  };
}

function secureCompare(value: string, expected: string) {
  const valueHash = createHash("sha256")
    .update(value)
    .digest();

  const expectedHash = createHash("sha256")
    .update(expected)
    .digest();

  return timingSafeEqual(valueHash, expectedHash);
}

function createSignature(payload: string) {
  const { sessionSecret } = getAdminConfig();

  return createHmac("sha256", sessionSecret)
    .update(payload)
    .digest("hex");
}

export function validateAdminCredentials(
  username: string,
  password: string
) {
  const admin = getAdminConfig();

  return (
    secureCompare(username, admin.username) &&
    secureCompare(password, admin.password)
  );
}

export function createAdminSessionToken() {
  const { username } = getAdminConfig();

  const expiresAt =
    Math.floor(Date.now() / 1000) +
    SESSION_DURATION_SECONDS;

  const payload = `${username}:${expiresAt}`;
  const encodedPayload =
    Buffer.from(payload).toString("base64url");

  const signature = createSignature(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifyAdminSessionToken(
  token: string | undefined
) {
  if (!token) {
    return false;
  }

  const [encodedPayload, providedSignature] =
    token.split(".");

  if (!encodedPayload || !providedSignature) {
    return false;
  }

  const expectedSignature =
    createSignature(encodedPayload);

  if (
    !secureCompare(
      providedSignature,
      expectedSignature
    )
  ) {
    return false;
  }

  try {
    const payload = Buffer.from(
      encodedPayload,
      "base64url"
    ).toString("utf8");

    const [username, expiresAtValue] =
      payload.split(":");

    const expiresAt = Number(expiresAtValue);
    const admin = getAdminConfig();

    return (
      username === admin.username &&
      Number.isInteger(expiresAt) &&
      expiresAt > Math.floor(Date.now() / 1000)
    );
  } catch {
    return false;
  }
}

export async function setAdminSession() {
  const cookieStore = await cookies();

  cookieStore.set(
    ADMIN_COOKIE_NAME,
    createAdminSessionToken(),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION_SECONDS,
    }
  );
}

export async function clearAdminSession() {
  const cookieStore = await cookies();

  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    ADMIN_COOKIE_NAME
  )?.value;

  return verifyAdminSessionToken(token);
}