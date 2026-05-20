import { AppShell } from "@/components/layout/AppShell";
import { getCurrentProfile } from "@/lib/data/profile";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  return <AppShell isAdmin={profile?.is_admin}>{children}</AppShell>;
}
