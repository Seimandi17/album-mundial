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

export function formatStickerType(type: string) {
  const labels: Record<string, string> = {
    fwc_special: "Especial FWC",
    history: "Historia",
    host_city: "Sede",
    mascot: "Mascota",
    numbered: "Numerada",
    official_ball: "Pelota oficial",
    official_emblem: "Emblema oficial",
    official_slogan: "Slogan oficial",
    panini_logo: "Logo Panini",
    player: "Jugador",
    special: "Especial",
    team_logo: "Escudo",
    team_photo: "Foto equipo",
    trophy: "Trofeo",
  };

  return labels[type] ?? type.replaceAll("_", " ");
}

export function getStickerInitials(sticker: {
  code?: string | null;
  country_code?: string | null;
  team?: string | null;
  player_name?: string | null;
}) {
  if (sticker.country_code) return sticker.country_code.slice(0, 3);
  if (sticker.code) return sticker.code.split(" ")[0].slice(0, 3);
  if (sticker.team) return sticker.team.slice(0, 3).toUpperCase();
  if (sticker.player_name) {
    return sticker.player_name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 3)
      .toUpperCase();
  }
  return "FWC";
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
