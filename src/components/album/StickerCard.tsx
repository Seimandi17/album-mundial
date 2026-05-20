"use client";

import { useTransition } from "react";
import { updateUserSticker } from "@/app/actions/stickers";
import { Badge } from "@/components/ui/Badge";
import {
  formatStickerLabel,
  formatStickerType,
  getStickerInitials,
} from "@/lib/utils";
import type { StickerGridItem } from "@/types/database";
import { cn } from "@/lib/utils";

export function StickerCard({
  item,
  compact = false,
}: {
  item: StickerGridItem;
  compact?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const hasSticker = item.user_sticker?.has_sticker ?? false;
  const repeated = item.user_sticker?.repeated_quantity ?? 0;
  const initials = getStickerInitials(item);
  const typeLabel = formatStickerType(item.sticker_type);

  function submitUpdate(next: { hasSticker?: boolean; repeated?: number }) {
    const formData = new FormData();
    formData.set("stickerId", item.id);
    formData.set("hasSticker", String(next.hasSticker ?? hasSticker));
    formData.set("repeatedQuantity", String(next.repeated ?? repeated));

    startTransition(async () => {
      await updateUserSticker(formData);
    });
  }

  return (
    <article
      className={cn(
        "overflow-hidden rounded-2xl border bg-white shadow-sm transition",
        hasSticker ? "border-emerald-200 bg-emerald-50/40" : "border-slate-200",
        isPending && "opacity-60",
      )}
    >
      <div
        className={cn(
          "relative flex aspect-[3/4] flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 p-3 text-white",
          item.is_special &&
            "from-amber-300 via-yellow-500 to-emerald-700 text-slate-950",
          compact && "aspect-[4/3] p-2",
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <span
            className={cn(
              "rounded-full bg-white/15 px-2 py-1 text-[11px] font-bold uppercase tracking-wide backdrop-blur",
              item.is_special && "bg-white/45",
            )}
          >
            {item.code ?? `#${item.number}`}
          </span>
          <span
            className={cn(
              "rounded-full bg-white/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide backdrop-blur",
              item.is_special && "bg-white/45",
            )}
          >
            {typeLabel}
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div
            className={cn(
              "flex h-20 w-20 items-center justify-center rounded-2xl border border-white/30 bg-white/10 text-3xl font-black uppercase shadow-inner backdrop-blur",
              item.is_special && "border-white/50 bg-white/35",
              compact && "h-14 w-14 text-xl",
            )}
          >
            {initials}
          </div>
        </div>

        <div>
          <p
            className={cn(
              "line-clamp-2 text-lg font-black leading-tight",
              compact && "text-sm",
            )}
          >
            {item.player_name || item.team || formatStickerLabel(item)}
          </p>
          <p
            className={cn(
              "mt-1 truncate text-xs font-medium text-white/75",
              item.is_special && "text-slate-900/70",
            )}
          >
            {item.team || item.section || "FIFA World Cup 2026"}
          </p>
        </div>
      </div>

      <div className={cn("space-y-3 p-3", compact && "p-2")}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {formatStickerLabel(item)}
            </p>
            {item.section ? (
              <p className="truncate text-xs text-slate-500">{item.section}</p>
            ) : null}
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            {item.is_special ? <Badge tone="success">Especial</Badge> : null}
            {repeated > 0 ? <Badge tone="warning">x{repeated}</Badge> : null}
          </div>
        </div>

        {!compact ? (
          <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={hasSticker}
              onChange={(e) => submitUpdate({ hasSticker: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            La tengo pegada
          </label>
          <label className="block text-sm text-slate-700">
            <span className="mb-1 block text-xs text-slate-500">Repetidas</span>
            <input
              type="number"
              min={0}
              value={repeated}
              onChange={(e) =>
                submitUpdate({ repeated: Number(e.target.value) })
              }
              className="w-full rounded-lg border border-slate-200 px-2 py-1 text-sm"
            />
          </label>
          </div>
        ) : null}
      </div>
    </article>
  );
}
