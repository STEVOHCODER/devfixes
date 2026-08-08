import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin-dashboard";
import { AdminLogin } from "@/components/admin-login";
import { adminIsConfigured, isAdminSession } from "@/lib/admin-auth";
import { getAdminErrors } from "@/lib/error-repository";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authenticated = await isAdminSession();
  if (!authenticated) return <AdminLogin configured={adminIsConfigured()} />;

  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
  const entries = supabaseConfigured ? await getAdminErrors().catch(() => []) : [];

  return (
    <AdminDashboard
      initialEntries={entries}
      today={new Date().toISOString().slice(0, 10)}
      supabaseConfigured={supabaseConfigured}
    />
  );
}
