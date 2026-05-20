import { Card } from "@/components/ui/Card";

export function AlbumStats({
  total,
  owned,
  missing,
  duplicates,
}: {
  total: number;
  owned: number;
  missing: number;
  duplicates: number;
}) {
  const progress = total > 0 ? Math.round((owned / total) * 100) : 0;

  return (
    <div className="grid gap-3 sm:grid-cols-4">
      <Card className="!p-4">
        <p className="text-xs uppercase tracking-wide text-slate-500">Progreso</p>
        <p className="mt-1 text-2xl font-bold text-emerald-700">{progress}%</p>
        <p className="text-sm text-slate-600">
          {owned} / {total}
        </p>
      </Card>
      <Card className="!p-4">
        <p className="text-xs uppercase tracking-wide text-slate-500">Pegadas</p>
        <p className="mt-1 text-2xl font-bold text-slate-900">{owned}</p>
      </Card>
      <Card className="!p-4">
        <p className="text-xs uppercase tracking-wide text-slate-500">Faltantes</p>
        <p className="mt-1 text-2xl font-bold text-amber-700">{missing}</p>
      </Card>
      <Card className="!p-4">
        <p className="text-xs uppercase tracking-wide text-slate-500">Repetidas</p>
        <p className="mt-1 text-2xl font-bold text-blue-700">{duplicates}</p>
      </Card>
    </div>
  );
}
