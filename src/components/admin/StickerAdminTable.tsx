"use client";

import { useState, useTransition } from "react";
import {
  deleteSticker,
  seedStickersFromConfig,
  updateAlbumConfig,
  upsertSticker,
} from "@/app/actions/admin";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import type { AlbumConfig, Sticker } from "@/types/database";

export function StickerAdminPanel({
  stickers,
  config,
}: {
  stickers: Sticker[];
  config: AlbumConfig | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState<Sticker | null>(null);

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-lg font-semibold text-slate-900">Configuración del álbum</h2>
        <form
          action={(formData) =>
            startTransition(async () => {
              await updateAlbumConfig(formData);
            })
          }
          className="mt-4 grid gap-3 sm:grid-cols-3"
        >
          <Input
            label="Nombre"
            name="name"
            defaultValue={config?.name ?? "Álbum Mundial 2026"}
          />
          <Input
            label="Total de figuritas"
            name="totalStickers"
            type="number"
            min={1}
            defaultValue={config?.total_stickers ?? 700}
          />
          <div className="flex items-end">
            <Button type="submit" disabled={isPending}>
              Guardar config
            </Button>
          </div>
        </form>
        <form
          action={() =>
            startTransition(async () => {
              await seedStickersFromConfig();
            })
          }
          className="mt-3"
        >
          <Button type="submit" variant="secondary" disabled={isPending}>
            Generar figuritas numeradas (1..N)
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-slate-900">
          {editing ? `Editar #${editing.number}` : "Nueva figurita"}
        </h2>
        <form
          action={(formData) =>
            startTransition(async () => {
              await upsertSticker(formData);
              setEditing(null);
            })
          }
          className="mt-4 grid gap-3 sm:grid-cols-2"
        >
          <input type="hidden" name="id" value={editing?.id ?? ""} />
          <Input
            label="Número"
            name="number"
            type="number"
            min={1}
            required
            defaultValue={editing?.number ?? ""}
          />
          <Input label="Sección" name="section" defaultValue={editing?.section ?? ""} />
          <Input label="Equipo" name="team" defaultValue={editing?.team ?? ""} />
          <Input
            label="Jugador / nombre"
            name="playerName"
            defaultValue={editing?.player_name ?? ""}
          />
          <Input
            label="URL imagen"
            name="imageUrl"
            defaultValue={editing?.image_url ?? ""}
            className="sm:col-span-2"
          />
          <div className="flex gap-2 sm:col-span-2">
            <Button type="submit" disabled={isPending}>
              {editing ? "Actualizar" : "Crear"}
            </Button>
            {editing ? (
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
                Cancelar
              </Button>
            ) : null}
          </div>
        </form>
      </Card>

      <Card className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="px-2 py-2">#</th>
              <th className="px-2 py-2">Equipo</th>
              <th className="px-2 py-2">Jugador</th>
              <th className="px-2 py-2">Sección</th>
              <th className="px-2 py-2" />
            </tr>
          </thead>
          <tbody>
            {stickers.slice(0, 200).map((sticker) => (
              <tr key={sticker.id} className="border-b border-slate-100">
                <td className="px-2 py-2 font-medium">{sticker.number}</td>
                <td className="px-2 py-2">{sticker.team ?? "—"}</td>
                <td className="px-2 py-2">{sticker.player_name ?? "—"}</td>
                <td className="px-2 py-2">{sticker.section ?? "—"}</td>
                <td className="px-2 py-2 text-right">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditing(sticker)}
                  >
                    Editar
                  </Button>
                  <form
                    action={() =>
                      startTransition(async () => {
                        const fd = new FormData();
                        fd.set("id", sticker.id);
                        await deleteSticker(fd);
                      })
                    }
                    className="inline"
                  >
                    <Button type="submit" size="sm" variant="danger">
                      Borrar
                    </Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {stickers.length > 200 ? (
          <p className="mt-3 text-xs text-slate-500">
            Mostrando las primeras 200 de {stickers.length} figuritas.
          </p>
        ) : null}
      </Card>
    </div>
  );
}
