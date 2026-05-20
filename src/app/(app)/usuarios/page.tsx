import { UserCard } from "@/components/users/UserCard";
import { UserSearchForm } from "@/components/users/UserSearchForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { getCurrentProfile, searchProfiles } from "@/lib/data/profile";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function UsersList({
  province,
  city,
}: {
  province?: string;
  city?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const users = await searchProfiles({
    province,
    city,
    excludeUserId: user.id,
  });

  if (users.length === 0) {
    return (
      <EmptyState
        title="No hay usuarios"
        description="Probá otra provincia o localidad."
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {users.map((profile) => (
        <UserCard key={profile.id} profile={profile} />
      ))}
    </div>
  );
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ province?: string; city?: string }>;
}) {
  const params = await searchParams;
  const profile = await getCurrentProfile();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Buscar coleccionistas</h1>
        <p className="text-sm text-slate-600">
          Encontrá personas por localidad o provincia para coordinar intercambios.
        </p>
      </div>

      <Suspense fallback={null}>
        <UserSearchForm />
      </Suspense>

      <Suspense fallback={<p className="text-sm text-slate-500">Buscando...</p>}>
        <UsersList
          province={params.province ?? profile?.province}
          city={params.city}
        />
      </Suspense>
    </div>
  );
}
