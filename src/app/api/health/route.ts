import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    services: {
      ai: Boolean(process.env.OPENAI_API_KEY),
      supabase: Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
          process.env.SUPABASE_SERVICE_ROLE_KEY,
      ),
      r2: Boolean(
        process.env.CLOUDFLARE_R2_ACCOUNT_ID &&
          process.env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
          process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY &&
          process.env.CLOUDFLARE_R2_BUCKET,
      ),
      admin: Boolean(process.env.DEVFIXES_ADMIN_TOKEN),
      adsense: Boolean(
        process.env.NEXT_PUBLIC_ADSENSE_CLIENT &&
          process.env.ADSENSE_PUBLISHER_ID,
      ),
    },
  });
}
