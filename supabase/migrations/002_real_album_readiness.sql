-- Álbum Mundial 2026 — preparación para checklist real Panini
-- Ejecutar después de 001_initial_schema.sql en proyectos ya creados.
--
-- Objetivo:
-- - Actualizar el álbum a 980 figuritas.
-- - Agregar campos para checklist oficial: código, selección, tipo y fuente.
-- - Mantener intactas las colecciones existentes de usuarios.

update public.album_config
set
  total_stickers = 980,
  updated_at = now()
where id = 'mundial-2026';

alter table public.stickers
  add column if not exists code text,
  add column if not exists country_code text,
  add column if not exists sticker_type text not null default 'numbered',
  add column if not exists is_special boolean not null default false,
  add column if not exists source_name text,
  add column if not exists source_url text,
  add column if not exists verified_at timestamptz;

create unique index if not exists stickers_code_unique_idx
  on public.stickers (code)
  where code is not null;

create index if not exists stickers_country_code_idx
  on public.stickers (country_code);

create index if not exists stickers_sticker_type_idx
  on public.stickers (sticker_type);

create index if not exists stickers_is_special_idx
  on public.stickers (is_special)
  where is_special = true;

-- Completa la numeración oficial total conocida (980) sin borrar ni pisar filas.
insert into public.stickers (number, team, player_name, section, sticker_type)
select n, null, null, null, 'numbered'
from generate_series(1, 980) as n
on conflict (number) do nothing;

-- Refresca la vista para que futuras consultas puedan usar metadatos reales.
-- Se elimina antes porque PostgreSQL no permite cambiar el orden/nombre de
-- columnas de una vista existente con create or replace view.
drop view if exists public.user_sticker_summary;

create view public.user_sticker_summary as
select
  us.user_id,
  s.number as sticker_number,
  s.code as sticker_code,
  s.country_code,
  s.team,
  s.player_name,
  s.section,
  s.sticker_type,
  s.is_special,
  s.id as sticker_id,
  us.has_sticker,
  us.repeated_quantity,
  (not us.has_sticker) as is_missing,
  (us.repeated_quantity > 0) as is_duplicate
from public.user_stickers us
join public.stickers s on s.id = us.sticker_id;

grant select on public.user_sticker_summary to authenticated;
