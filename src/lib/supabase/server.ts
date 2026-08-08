import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let adminClient: SupabaseClient | null | undefined;

export function getSupabaseAdmin() {
  if (adminClient !== undefined) return adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  adminClient =
    url && serviceKey
      ? createClient(url, serviceKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        })
      : null;

  return adminClient;
}

export async function trackEvent(
  event: string,
  payload: Record<string, unknown>,
) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  await supabase
    .from("analytics_events")
    .insert({ event_name: event, payload })
    .then(() => undefined);
}
