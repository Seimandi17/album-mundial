"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn, signUp } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await signIn(formData);
    if (result?.error) setError(result.error);
  }

  return (
    <Card>
      <form action={handleSubmit} className="space-y-4">
        <input type="hidden" name="redirectTo" value={redirectTo ?? "/album"} />
        <Input label="Email" name="email" type="email" required autoComplete="email" />
        <Input
          label="Contraseña"
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" className="w-full">
          Iniciar sesión
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-600">
        ¿No tenés cuenta?{" "}
        <Link href="/register" className="font-medium text-emerald-700 hover:underline">
          Registrate
        </Link>
      </p>
    </Card>
  );
}

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await signUp(formData);
    if (result?.error) setError(result.error);
  }

  return (
    <Card>
      <form action={handleSubmit} className="space-y-4">
        <Input label="Nombre" name="name" required autoComplete="name" />
        <Input label="Email" name="email" type="email" required autoComplete="email" />
        <Input
          label="Contraseña"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          hint="Mínimo 6 caracteres"
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" className="w-full">
          Crear cuenta
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-600">
        ¿Ya tenés cuenta?{" "}
        <Link href="/login" className="font-medium text-emerald-700 hover:underline">
          Iniciar sesión
        </Link>
      </p>
    </Card>
  );
}
