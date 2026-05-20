import { MatchCard } from "@/components/matches/MatchCard";
import { UserSearchForm } from "@/components/users/UserSearchForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { getMatchesForCurrentUser } from "@/lib/data/matches";
import { getCurrentProfile } from "@/lib/data/profile";
import { Suspense } from "react";

async function MatchesList({
  province,
  city,
  userId,
}: {
  province?: string;
  city?: string;
  userId?: string;
}) {
  const { matches, profileName } = await getMatchesForCurrentUser({
    province,
    city,
    targetUserId: userId,
  });

  if (matches.length === 0) {
    return (
      <EmptyState
        title="Sin coincidencias por ahora"
        description="Completá tu álbum y buscá en tu provincia o localidad cuando otros coleccionistas carguen sus repetidas."
      />
    );
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <MatchCard key={match.user.id} match={match} myName={profileName} />
      ))}
    </div>
  );
}

export default async function MatchesPage({
  searchParams,
}: {
  searchParams: Promise<{ province?: string; city?: string; userId?: string }>;
}) {
  const params = await searchParams;
  const profile = await getCurrentProfile();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Coincidencias</h1>
        <p className="text-sm text-slate-600">
          Compará tus faltantes con repetidas de otros y tus repetidas con sus
          faltantes. Por defecto se usa tu provincia
          {profile?.province ? `: ${profile.province}` : ""}.
        </p>
      </div>

      <Suspense fallback={<p className="text-sm text-slate-500">Cargando filtros...</p>}>
        <UserSearchForm />
      </Suspense>

      <Suspense fallback={<p className="text-sm text-slate-500">Calculando coincidencias...</p>}>
        <MatchesList
          province={params.province ?? profile?.province}
          city={params.city}
          userId={params.userId}
        />
      </Suspense>
    </div>
  );
}
