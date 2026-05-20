import { ProfileForm } from "@/components/profile/ProfileForm";
import { Card } from "@/components/ui/Card";
import { getCurrentProfile } from "@/lib/data/profile";
import { redirect } from "next/navigation";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const params = await searchParams;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mi perfil</h1>
        <p className="text-sm text-slate-600">
          Estos datos se usan para buscar intercambios en tu zona y contactarte.
        </p>
      </div>

      {params.welcome ? (
        <Card className="border-emerald-200 bg-emerald-50 !p-4 text-sm text-emerald-900">
          ¡Bienvenido! Completá tu localidad, provincia y un medio de contacto para
          empezar a intercambiar.
        </Card>
      ) : null}

      <ProfileForm profile={profile} />
    </div>
  );
}
