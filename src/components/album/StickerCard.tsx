"use client";

import { useTransition } from "react";
import { updateUserSticker } from "@/app/actions/stickers";
import { Badge } from "@/components/ui/Badge";
import { formatStickerLabel } from "@/lib/utils";
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
        "rounded-xl border bg-white p-3 shadow-sm transition",
        hasSticker ? "border-emerald-200 bg-emerald-50/40" : "border-slate-200",
        isPending && "opacity-60",
        compact && "p-2",
      )}
    >
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
      {item.team || item.sticker_type !== "numbered" ? (
        <p className="mt-1 truncate text-xs text-slate-500">
          {[item.team, item.sticker_type].filter(Boolean).join(" · ")}
        </p>
      ) : null}

      {!compact ? (
        <div className="mt-3 space-y-2">
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
    </article>
  );
}
