import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { APP_NAME } from "@/lib/constants";
import { MainNav } from "./MainNav";
import { Button } from "@/components/ui/Button";

export function AppShell({
  children,
  isAdmin,
}: {
  children: React.ReactNode;
  isAdmin?: boolean;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Link href="/album" className="text-lg font-bold text-slate-900">
                {APP_NAME}
              </Link>
              <p className="text-xs text-slate-500">
                Intercambio de figuritas físicas
              </p>
            </div>
            <form action={signOut}>
              <Button type="submit" variant="ghost" size="sm">
                Salir
              </Button>
            </form>
          </div>
          <MainNav isAdmin={isAdmin} />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
