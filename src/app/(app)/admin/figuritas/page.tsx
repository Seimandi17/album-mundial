import { StickerAdminPanel } from "@/components/admin/StickerAdminTable";
import { getAlbumConfig, getAllStickers } from "@/lib/data/stickers";
import { getCurrentProfile } from "@/lib/data/profile";
import { redirect } from "next/navigation";

export default async function AdminStickersPage() {
  const profile = await getCurrentProfile();
  if (!profile?.is_admin) {
    redirect("/album");
  }

  const [stickers, config] = await Promise.all([
    getAllStickers(),
    getAlbumConfig(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin · Figuritas</h1>
        <p className="text-sm text-slate-600">
          Cargá el listado numerado del álbum y completá equipos/jugadores cuando
          estén definidos oficialmente.
        </p>
      </div>
      <StickerAdminPanel stickers={stickers} config={config} />
    </div>
  );
}
