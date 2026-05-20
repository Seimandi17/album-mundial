"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ARGENTINA_PROVINCES } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export function UserSearchForm() {
  const router = useRouter();
  const params = useSearchParams();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const province = String(formData.get("province") ?? "");
    const city = String(formData.get("city") ?? "");
    const search = new URLSearchParams();
    if (province) search.set("province", province);
    if (city) search.set("city", city);
    router.push(`/usuarios?${search.toString()}`);
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-3">
        <label className="block space-y-1.5 sm:col-span-1">
          <span className="text-sm font-medium text-slate-700">Provincia</span>
          <select
            name="province"
            defaultValue={params.get("province") ?? ""}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            <option value="">Todas</option>
            {ARGENTINA_PROVINCES.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
        </label>
        <Input
          label="Localidad"
          name="city"
          defaultValue={params.get("city") ?? ""}
          placeholder="Ej: Rosario"
        />
        <div className="flex items-end">
          <Button type="submit" className="w-full sm:w-auto">
            Buscar
          </Button>
        </div>
      </form>
    </Card>
  );
}
