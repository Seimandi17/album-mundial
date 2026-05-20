export const APP_NAME = "Álbum Mundial 2026";
export const ALBUM_ID = "mundial-2026";

export const ARGENTINA_PROVINCES = [
  "Buenos Aires",
  "Ciudad Autónoma de Buenos Aires",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
] as const;

export const NAV_ITEMS = [
  { href: "/album", label: "Mi álbum" },
  { href: "/album/faltantes", label: "Faltantes" },
  { href: "/album/repetidas", label: "Repetidas" },
  { href: "/coincidencias", label: "Coincidencias" },
  { href: "/usuarios", label: "Buscar" },
  { href: "/perfil", label: "Perfil" },
] as const;
