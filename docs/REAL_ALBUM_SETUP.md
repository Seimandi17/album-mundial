# Checklist real Panini Mundial 2026

Esta guía deja la app preparada para trabajar con el álbum real de Panini sin cargar datos inventados.

## Estado verificado

- Total de figuritas: **980**
- Especiales informadas públicamente: **68**
- Álbum: **112 páginas**
- Sobres: **7 figuritas**
- Colaboración Coca-Cola: **12 stickers exclusivos**

Estos datos deben mantenerse trazables con `source_name`, `source_url` y `verified_at`.

## Archivos importantes

- `supabase/migrations/002_real_album_readiness.sql`: migra una base ya creada de 700 a 980 y agrega campos reales.
- `supabase/seed.sql`: crea figuritas numeradas hasta `album_config.total_stickers`.
- `data/world-cup-2026-checklist.template.csv`: plantilla para armar/importar el checklist oficial.

## Campos reales disponibles

| Campo | Uso |
|------|-----|
| `number` | número global interno de la app, 1..980 |
| `code` | código visible/oficial si existe, por ejemplo `ARG 10` |
| `country_code` | código de selección, por ejemplo `ARG` |
| `team` | nombre de selección o grupo |
| `player_name` | jugador, mascota, estadio u otro nombre |
| `section` | sección del álbum |
| `sticker_type` | `player`, `team_logo`, `team_photo`, `history`, `host_city`, `mascot`, `trophy`, `coca_cola`, `special`, etc. |
| `is_special` | `true` para foil/especial/premium |
| `source_name` | fuente usada para verificar |
| `source_url` | URL de fuente si aplica |
| `verified_at` | fecha de verificación |

## Paso a paso para tu Supabase actual

1. Entrá a Supabase → **SQL Editor**.
2. Abrí `supabase/migrations/002_real_album_readiness.sql`.
3. Copiá todo el contenido y ejecutalo.
4. Verificá:

```sql
select total_stickers from public.album_config where id = 'mundial-2026';
select count(*) from public.stickers;
```

Debería devolver `980` en ambos casos si no hay stickers extra.

## Cómo cargar el checklist oficial

Cuando tengas el checklist verificado:

1. Armá un CSV usando `data/world-cup-2026-checklist.template.csv`.
2. En Supabase → **Table Editor** → `stickers` → **Import data from CSV**.
3. Usá `number` como referencia estable y evitá duplicar filas.
4. Si preferís SQL, cargá por `upsert`:

```sql
insert into public.stickers (
  number,
  code,
  country_code,
  team,
  player_name,
  section,
  sticker_type,
  is_special,
  source_name,
  source_url,
  verified_at
)
values
  (1, 'FWC 1', null, null, 'Ejemplo verificado', 'World Cup History', 'history', true, 'Fuente', 'https://...', now())
on conflict (number) do update set
  code = excluded.code,
  country_code = excluded.country_code,
  team = excluded.team,
  player_name = excluded.player_name,
  section = excluded.section,
  sticker_type = excluded.sticker_type,
  is_special = excluded.is_special,
  source_name = excluded.source_name,
  source_url = excluded.source_url,
  verified_at = excluded.verified_at,
  updated_at = now();
```

## Reglas para mantenerlo 100% real

- No cargar jugadores, selecciones ni códigos sin fuente.
- No usar imágenes oficiales sin permiso/licencia.
- Cada lote importado debe tener `source_name` o `source_url`.
- Si hay diferencias por país/edición regional, crear una decisión explícita antes de mezclar datos.
- Mantener `number` como ID interno estable aunque el álbum use códigos por sección.

## Checklist antes de deploy

1. Ejecutar migración `002_real_album_readiness.sql`.
2. Confirmar `album_config.total_stickers = 980`.
3. Confirmar `stickers` tiene 980 filas.
4. Entrar como admin a `/admin/figuritas`.
5. Editar una figurita de prueba y verificar que aparecen código, tipo y especial.
6. Hacer redeploy en Vercel si cambiaste código.
