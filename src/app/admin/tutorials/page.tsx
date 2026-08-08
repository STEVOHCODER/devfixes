import type { Metadata } from "next";
import { AdminLogin } from "@/components/admin-login";
import { AdminTutorialStudio } from "@/components/admin-tutorial-studio";
import { adminIsConfigured, isAdminSession } from "@/lib/admin-auth";
import { localTutorialPublishingEnabled } from "@/lib/local-tutorial-store";
import { getAdminTutorials } from "@/lib/tutorial-repository";

export const metadata: Metadata = {
  title: "Tutorial studio",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminTutorialsPage() {
  const authenticated = await isAdminSession();
  if (!authenticated) return <AdminLogin configured={adminIsConfigured()} />;

  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
  const localPublishing = localTutorialPublishingEnabled();
  const entries = await getAdminTutorials().catch(() => []);

  return (
    <AdminTutorialStudio
      initialEntries={entries}
      today={new Date().toISOString().slice(0, 10)}
      storageMode={supabaseConfigured ? "supabase" : localPublishing ? "local" : "unavailable"}
    />
  );
}
