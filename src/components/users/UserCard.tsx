import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { buildInstagramUrl, buildWhatsAppUrl } from "@/lib/utils";
import type { Profile } from "@/types/database";

export function UserCard({ profile }: { profile: Profile }) {
  const whatsappUrl = profile.whatsapp
    ? buildWhatsAppUrl(
        profile.whatsapp,
        `Hola ${profile.name}, vi tu perfil en Álbum Mundial 2026. ¿Intercambiamos figuritas?`,
      )
    : null;

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">
            {profile.name || "Coleccionista"}
          </h3>
          <p className="text-sm text-slate-600">
            {profile.city}
            {profile.city && profile.province ? " · " : ""}
            {profile.province}
          </p>
        </div>
        {profile.whatsapp ? <Badge tone="success">WhatsApp</Badge> : null}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href={`/coincidencias?userId=${profile.id}`}
          className="text-sm font-medium text-emerald-700 hover:underline"
        >
          Ver coincidencias
        </Link>
        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-slate-700 hover:underline"
          >
            WhatsApp
          </a>
        ) : null}
        {profile.instagram ? (
          <a
            href={buildInstagramUrl(profile.instagram)}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-slate-700 hover:underline"
          >
            Instagram
          </a>
        ) : null}
      </div>
    </Card>
  );
}
