import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { z } from "zod";
import { trackEvent } from "@/lib/supabase/server";

const requestSchema = z.object({
  filename: z.string().min(1).max(180),
  contentType: z.string().max(120).default("text/plain"),
  size: z.number().int().positive().max(5 * 1024 * 1024),
});

const allowedTypes = new Set([
  "text/plain",
  "text/x-log",
  "application/json",
  "text/csv",
  "application/x-yaml",
]);

function safeName(filename: string) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
}

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid upload request." }, { status: 400 });
  }

  const { filename, size } = parsed.data;
  const contentType = allowedTypes.has(parsed.data.contentType)
    ? parsed.data.contentType
    : "text/plain";
  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  const bucket = process.env.CLOUDFLARE_R2_BUCKET;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
    return NextResponse.json(
      { error: "Cloudflare R2 is not configured on this deployment." },
      { status: 503 },
    );
  }

  const key = `logs/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safeName(filename)}`;
  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
    ContentLength: size,
    Metadata: { source: "devfixes-debugger" },
  });
  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 600 });

  await trackEvent("log_upload_presigned", { key, size, contentType });
  return NextResponse.json({ uploadUrl, key, expiresIn: 600 });
}
