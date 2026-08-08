import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const adminCookieName = "devfixes_admin";

function configuredToken() {
  return process.env.DEVFIXES_ADMIN_TOKEN?.trim();
}

function sessionValue(secret: string) {
  return createHmac("sha256", secret)
    .update("devfixes-admin-session-v1")
    .digest("base64url");
}

export function adminIsConfigured() {
  return Boolean(configuredToken());
}

export function adminTokenMatches(candidate: string) {
  const expected = configuredToken();
  if (!expected) return false;
  const candidateBuffer = Buffer.from(candidate);
  const expectedBuffer = Buffer.from(expected);
  return (
    candidateBuffer.length === expectedBuffer.length &&
    timingSafeEqual(candidateBuffer, expectedBuffer)
  );
}

export function createAdminSessionValue() {
  const secret = configuredToken();
  return secret ? sessionValue(secret) : "";
}

export async function isAdminSession() {
  const secret = configuredToken();
  if (!secret) return false;
  const cookieStore = await cookies();
  const current = cookieStore.get(adminCookieName)?.value;
  if (!current) return false;
  const expected = sessionValue(secret);
  const currentBuffer = Buffer.from(current);
  const expectedBuffer = Buffer.from(expected);
  return (
    currentBuffer.length === expectedBuffer.length &&
    timingSafeEqual(currentBuffer, expectedBuffer)
  );
}
