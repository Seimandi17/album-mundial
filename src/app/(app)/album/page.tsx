import { AlbumStats } from "@/components/album/AlbumStats";
import { StickerGrid } from "@/components/album/StickerGrid";
import { getCurrentProfile } from "@/lib/data/profile";
import {
  filterDuplicates,
  filterMissing,
  getAlbumConfig,
  getAlbumGrid,
} from "@/lib/data/stickers";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AlbumPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [grid, config, profile] = await Promise.all([
    getAlbumGrid(user.id),
    getAlbumConfig(),
    getCurrentProfile(),
  ]);

  const total = config?.total_stickers ?? grid.length;
  const owned = grid.filter((item) => item.user_sticker?.has_sticker).length;
  const missing = filterMissing(grid).length;
  const duplicates = filterDuplicates(grid).reduce(
    (acc, item) => acc + (item.user_sticker?.repeated_quantity ?? 0),
    0,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Mi álbum {config?.name ?? "Mundial 2026"}
        </h1>
        <p className="text-sm text-slate-600">
          Marcá las figuritas pegadas y cargá tus repetidas. Podés completar nombres
          de jugadores más adelante.
        </p>
        {profile && (!profile.city || !profile.province) ? (
          <p className="mt-2 text-sm text-amber-700">
            Completá tu perfil en{" "}
            <a href="/perfil" className="font-medium underline">
              Perfil
            </a>{" "}
            para encontrar intercambios en tu zona.
          </p>
        ) : null}
      </div>

      <AlbumStats
        total={total}
        owned={owned}
        missing={missing}
        duplicates={duplicates}
      />

      {grid.length === 0 ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Aún no hay figuritas cargadas. Un administrador debe ejecutar el seed en
          Supabase o usar el panel admin.
        </p>
      ) : (
        <StickerGrid items={grid} />
      )}
    </div>
  );
}
