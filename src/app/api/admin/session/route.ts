import { NextResponse } from "next/server";
import { z } from "zod";
import {
  adminCookieName,
  adminIsConfigured,
  adminTokenMatches,
  createAdminSessionValue,
} from "@/lib/admin-auth";

const schema = z.object({ token: z.string().min(1).max(500) });

export async function POST(request: Request) {
  if (!adminIsConfigured()) {
    return NextResponse.json(
      { error: "Set DEVFIXES_ADMIN_TOKEN before using the admin area." },
      { status: 503 },
    );
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !adminTokenMatches(parsed.data.token)) {
    return NextResponse.json({ error: "Invalid admin token." }, { status: 401 });
  }

  const response = NextResponse.json({ authenticated: true });
  response.cookies.set(adminCookieName, createAdminSessionValue(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(adminCookieName, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
