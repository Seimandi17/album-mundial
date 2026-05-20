import { AlbumBrowser } from "@/components/album/AlbumBrowser";
import { filterDuplicates, getAlbumGrid } from "@/lib/data/stickers";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DuplicatesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const grid = await getAlbumGrid(user.id);
  const duplicates = filterDuplicates(grid);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mis repetidas</h1>
        <p className="text-sm text-slate-600">
          {duplicates.length} figuritas con al menos una repetida cargada.
        </p>
      </div>
      <AlbumBrowser
        items={duplicates}
        compact
        emptyTitle="Sin repetidas"
        emptyDescription="Cuando tengas repetidas, aparecerán acá."
      />
    </div>
  );
}
