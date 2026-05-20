import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  buildInstagramUrl,
  buildTradeMessage,
  buildWhatsAppUrl,
} from "@/lib/utils";
import type { TradeMatch } from "@/types/database";

export function MatchCard({
  match,
  myName,
}: {
  match: TradeMatch;
  myName: string;
}) {
  const message = buildTradeMessage({
    myName,
    theyHaveWhatINeed: match.theyHaveWhatINeed,
    iHaveWhatTheyNeed: match.iHaveWhatTheyNeed,
  });

  const whatsappUrl = match.user.whatsapp
    ? buildWhatsAppUrl(match.user.whatsapp, message)
    : null;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {match.user.name || "Coleccionista"}
          </h3>
          <p className="text-sm text-slate-600">
            {match.user.city}
            {match.user.city && match.user.province ? " · " : ""}
            {match.user.province}
          </p>
        </div>
        <Badge tone="success">{match.score} coincidencias</Badge>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Ellos tienen lo que me falta
          </p>
          <p className="mt-1 text-sm text-slate-700">
            {match.theyHaveWhatINeed.length > 0
              ? match.theyHaveWhatINeed.join(", ")
              : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
            Yo tengo lo que les falta
          </p>
          <p className="mt-1 text-sm text-slate-700">
            {match.iHaveWhatTheyNeed.length > 0
              ? match.iHaveWhatTheyNeed.join(", ")
              : "—"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {whatsappUrl ? (
          <a href={whatsappUrl} target="_blank" rel="noreferrer">
            <Button type="button">Contactar por WhatsApp</Button>
          </a>
        ) : (
          <Button type="button" disabled variant="secondary">
            Sin WhatsApp
          </Button>
        )}
        {match.user.instagram ? (
          <a href={buildInstagramUrl(match.user.instagram)} target="_blank" rel="noreferrer">
            <Button type="button" variant="secondary">
              Instagram
            </Button>
          </a>
        ) : null}
        <Link href={`/usuarios?province=${encodeURIComponent(match.user.province)}`}>
          <Button type="button" variant="ghost">
            Ver zona
          </Button>
        </Link>
      </div>
    </Card>
  );
}
