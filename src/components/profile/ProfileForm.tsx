"use client";

import { useState } from "react";
import { updateProfile } from "@/app/actions/profile";
import { ARGENTINA_PROVINCES } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import type { Profile } from "@/types/database";

export function ProfileForm({ profile }: { profile: Profile }) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setMessage(null);
    setError(null);
    const result = await updateProfile(formData);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setMessage("Perfil actualizado correctamente.");
  }

  return (
    <Card>
      <form action={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Nombre"
          name="name"
          defaultValue={profile.name}
          required
          className="sm:col-span-2"
        />
        <Input label="Localidad" name="city" defaultValue={profile.city} required />
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Provincia</span>
          <select
            name="province"
            defaultValue={profile.province}
            required
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            <option value="">Seleccionar...</option>
            {ARGENTINA_PROVINCES.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
        </label>
        <Input
          label="WhatsApp"
          name="whatsapp"
          defaultValue={profile.whatsapp ?? ""}
          placeholder="54911..."
          hint="Solo números, con código de país"
        />
        <Input
          label="Instagram"
          name="instagram"
          defaultValue={profile.instagram ?? ""}
          placeholder="@usuario"
        />
        <div className="sm:col-span-2">
          {error ? <p className="mb-2 text-sm text-red-600">{error}</p> : null}
          {message ? <p className="mb-2 text-sm text-emerald-700">{message}</p> : null}
          <Button type="submit">Guardar perfil</Button>
        </div>
      </form>
    </Card>
  );
}
