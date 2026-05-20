import { StickerGrid } from "@/components/album/StickerGrid";
import { filterMissing, getAlbumGrid } from "@/lib/data/stickers";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function MissingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const grid = await getAlbumGrid(user.id);
  const missing = filterMissing(grid);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mis faltantes</h1>
        <p className="text-sm text-slate-600">
          {missing.length} figuritas que aún no pegaste en tu álbum.
        </p>
      </div>
      <StickerGrid
        items={missing}
        compact
        emptyTitle="¡Felicitaciones!"
        emptyDescription="No tenés figuritas faltantes registradas."
      />
    </div>
  );
}
