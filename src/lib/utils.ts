export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatStickerLabel(sticker: {
  number: number;
  code?: string | null;
  team?: string | null;
  player_name?: string | null;
}) {
  const prefix = sticker.code ? sticker.code : `#${sticker.number}`;

  if (sticker.player_name) {
    return `${prefix} · ${sticker.player_name}`;
  }
  if (sticker.team) {
    return `${prefix} · ${sticker.team}`;
  }
  return prefix;
}

export function buildWhatsAppUrl(phone: string, message: string) {
  const digits = phone.replace(/\D/g, "");
  const text = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${text}`;
}

export function buildInstagramUrl(handle: string) {
  const username = handle.replace(/^@/, "").trim();
  return `https://instagram.com/${username}`;
}

export function buildTradeMessage(params: {
  myName: string;
  theyHaveWhatINeed: number[];
  iHaveWhatTheyNeed: number[];
}) {
  const lines = [
    `Hola! Soy ${params.myName} y vi tu perfil en Álbum Mundial 2026.`,
    "",
  ];

  if (params.theyHaveWhatINeed.length > 0) {
    lines.push(
      `Me faltan estas figuritas y vi que tenés repetidas: ${params.theyHaveWhatINeed.join(", ")}.`,
    );
  }

  if (params.iHaveWhatTheyNeed.length > 0) {
    lines.push(
      `Yo tengo repetidas estas que a vos te faltan: ${params.iHaveWhatTheyNeed.join(", ")}.`,
    );
  }

  lines.push("", "¿Te parece coordinar un intercambio?");
  return lines.join("\n");
}
