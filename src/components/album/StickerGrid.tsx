"use client";

import { useMemo, useState } from "react";
import { StickerCard } from "./StickerCard";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import type { StickerGridItem } from "@/types/database";

export function StickerGrid({
  items,
  compact = false,
  emptyTitle = "Sin figuritas",
  emptyDescription,
}: {
  items: StickerGridItem[];
  compact?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;

    return items.filter((item) => {
      const numberMatch = String(item.number).includes(q);
      const teamMatch = item.team?.toLowerCase().includes(q);
      const playerMatch = item.player_name?.toLowerCase().includes(q);
      const sectionMatch = item.section?.toLowerCase().includes(q);
      return numberMatch || teamMatch || playerMatch || sectionMatch;
    });
  }, [items, query]);

  if (items.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="space-y-4">
      <Input
        label="Buscar por número, equipo o jugador"
        name="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ej: 125, Argentina, Messi..."
      />
      <div
        className={
          compact
            ? "grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4"
            : "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        }
      >
        {filtered.map((item) => (
          <StickerCard key={item.id} item={item} compact={compact} />
        ))}
      </div>
      {filtered.length === 0 ? (
        <EmptyState
          title="Sin resultados"
          description="Probá con otro número o nombre."
        />
      ) : null}
    </div>
  );
}
