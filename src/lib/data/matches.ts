import { computeAllMatches } from "@/lib/matches";
import { getCurrentProfile, searchProfiles } from "@/lib/data/profile";
import { getUserCollection } from "@/lib/data/stickers";
import type { TradeMatch } from "@/types/database";
import { createClient } from "@/lib/supabase/server";

export async function getMatchesForCurrentUser(filters?: {
  province?: string;
  city?: string;
  targetUserId?: string;
}): Promise<{ matches: TradeMatch[]; profileName: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { matches: [], profileName: "" };
  }

  const profile = await getCurrentProfile();
  const myCollection = await getUserCollection(user.id);

  let others = await searchProfiles({
    province: filters?.province || profile?.province || undefined,
    city: filters?.city,
    excludeUserId: user.id,
  });

  if (filters?.targetUserId) {
    others = others.filter((p) => p.id === filters.targetUserId);
  }

  const collections = await Promise.all(
    others.map(async (other) => ({
      profile: other,
      collection: await getUserCollection(other.id),
    })),
  );

  const matches = computeAllMatches(user.id, myCollection, collections);

  return {
    matches,
    profileName: profile?.name ?? "Coleccionista",
  };
}
