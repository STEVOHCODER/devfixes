export function GET() {
  const publisherId = process.env.ADSENSE_PUBLISHER_ID?.replace(/^ca-/, "");
  if (!publisherId) {
    return new Response("# AdSense publisher ID is not configured.\n", {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  return new Response(
    `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`,
    {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "public, max-age=3600",
      },
    },
  );
}
