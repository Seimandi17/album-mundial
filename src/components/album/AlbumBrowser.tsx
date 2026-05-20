"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { StickerGrid } from "@/components/album/StickerGrid";
import { cn } from "@/lib/utils";
import type { StickerGridItem } from "@/types/database";

type SectionSummary = {
  key: string;
  label: string;
  total: number;
  owned: number;
  missing: number;
  duplicates: number;
  firstNumber: number;
  lastNumber: number;
};

const ALL_SECTIONS = "__all__";

function getSectionKey(item: StickerGridItem) {
  return item.section || item.team || "Sin sección";
}

function getInitialSection(summaries: SectionSummary[]) {
  const argentina = summaries.find((section) => section.key === "Argentina");
  return argentina?.key ?? summaries[0]?.key ?? ALL_SECTIONS;
}

export function AlbumBrowser({
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
  const summaries = useMemo(() => {
    const bySection = new Map<string, SectionSummary>();

    for (const item of items) {
      const key = getSectionKey(item);
      const current = bySection.get(key);
      const owned = item.user_sticker?.has_sticker ? 1 : 0;
      const repeated = item.user_sticker?.repeated_quantity ?? 0;

      if (!current) {
        bySection.set(key, {
          key,
          label: key,
          total: 1,
          owned,
          missing: owned ? 0 : 1,
          duplicates: repeated,
          firstNumber: item.number,
          lastNumber: item.number,
        });
        continue;
      }

      current.total += 1;
      current.owned += owned;
      current.missing += owned ? 0 : 1;
      current.duplicates += repeated;
      current.firstNumber = Math.min(current.firstNumber, item.number);
      current.lastNumber = Math.max(current.lastNumber, item.number);
    }

    return Array.from(bySection.values()).sort(
      (a, b) => a.firstNumber - b.firstNumber,
    );
  }, [items]);

  const [selectedSection, setSelectedSection] = useState(() =>
    getInitialSection(summaries),
  );

  const selectedSummary =
    selectedSection === ALL_SECTIONS
      ? null
      : summaries.find((summary) => summary.key === selectedSection);

  const visibleItems = useMemo(() => {
    if (selectedSection === ALL_SECTIONS) return items;
    return items.filter((item) => getSectionKey(item) === selectedSection);
  }, [items, selectedSection]);

  if (items.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
      <aside className="space-y-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <label className="block space-y-1.5 lg:hidden">
            <span className="text-sm font-medium text-slate-700">
              Selección / sección
            </span>
            <select
              value={selectedSection}
              onChange={(event) => setSelectedSection(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option value={ALL_SECTIONS}>Todas las secciones</option>
              {summaries.map((section) => (
                <option key={section.key} value={section.key}>
                  {section.label} ({section.total})
                </option>
              ))}
            </select>
          </label>

          <div className="hidden lg:block">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Selecciones y páginas
            </p>
            <div className="mt-3 max-h-[70vh] space-y-1 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => setSelectedSection(ALL_SECTIONS)}
                className={cn(
                  "w-full rounded-xl px-3 py-2 text-left text-sm transition",
                  selectedSection === ALL_SECTIONS
                    ? "bg-emerald-600 text-white"
                    : "text-slate-700 hover:bg-slate-100",
                )}
              >
                <span className="block font-semibold">Todas las secciones</span>
                <span className="text-xs opacity-75">{items.length} figuritas</span>
              </button>

              {summaries.map((section) => {
                const progress = Math.round((section.owned / section.total) * 100);
                const active = selectedSection === section.key;

                return (
                  <button
                    key={section.key}
                    type="button"
                    onClick={() => setSelectedSection(section.key)}
                    className={cn(
                      "w-full rounded-xl px-3 py-2 text-left text-sm transition",
                      active
                        ? "bg-emerald-600 text-white"
                        : "text-slate-700 hover:bg-slate-100",
                    )}
                  >
                    <span className="block truncate font-semibold">
                      {section.label}
                    </span>
                    <span className="block text-xs opacity-75">
                      #{section.firstNumber}-#{section.lastNumber} · {progress}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </aside>

      <section className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                {selectedSection === ALL_SECTIONS ? "Álbum completo" : "Sección"}
              </p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">
                {selectedSummary?.label ?? "Todas las secciones"}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {selectedSummary
                  ? `Figuritas #${selectedSummary.firstNumber} a #${selectedSummary.lastNumber}`
                  : "Vista general de todo el álbum"}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-xl bg-slate-100 px-3 py-2">
                <p className="font-bold text-slate-900">
                  {selectedSummary?.total ?? items.length}
                </p>
                <p className="text-slate-500">Total</p>
              </div>
              <div className="rounded-xl bg-emerald-100 px-3 py-2">
                <p className="font-bold text-emerald-800">
                  {selectedSummary?.owned ??
                    items.filter((item) => item.user_sticker?.has_sticker).length}
                </p>
                <p className="text-emerald-700">Pegadas</p>
              </div>
              <div className="rounded-xl bg-amber-100 px-3 py-2">
                <p className="font-bold text-amber-800">
                  {selectedSummary?.missing ??
                    items.filter((item) => !item.user_sticker?.has_sticker).length}
                </p>
                <p className="text-amber-700">Faltan</p>
              </div>
            </div>
          </div>
        </div>

        <StickerGrid
          items={visibleItems}
          compact={compact}
          emptyTitle={emptyTitle}
          emptyDescription={emptyDescription}
        />
      </section>
    </div>
  );
}
