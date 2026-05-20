-- Álbum Mundial 2026 — esquema inicial
-- Ejecutar en el SQL Editor de Supabase o con Supabase CLI

-- ---------------------------------------------------------------------------
-- Perfiles (extiende auth.users; equivale al modelo "users" del MVP)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  email text not null default '',
  city text not null default '',
  province text not null default '',
  whatsapp text,
  instagram text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_province_idx on public.profiles (province);
create index profiles_city_idx on public.profiles (city);
create index profiles_province_city_idx on public.profiles (province, city);

-- ---------------------------------------------------------------------------
-- Figuritas del álbum Mundial 2026
-- ---------------------------------------------------------------------------
create table public.stickers (
  id uuid primary key default gen_random_uuid(),
  number integer not null unique,
  team text,
  player_name text,
  section text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint stickers_number_positive check (number > 0)
);

create index stickers_number_idx on public.stickers (number);
create index stickers_section_idx on public.stickers (section);

-- ---------------------------------------------------------------------------
-- Colección por usuario
-- ---------------------------------------------------------------------------
create table public.user_stickers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  sticker_id uuid not null references public.stickers (id) on delete cascade,
  has_sticker boolean not null default false,
  repeated_quantity integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (user_id, sticker_id),
  constraint repeated_quantity_non_negative check (repeated_quantity >= 0)
);

create index user_stickers_user_id_idx on public.user_stickers (user_id);
create index user_stickers_sticker_id_idx on public.user_stickers (sticker_id);
create index user_stickers_has_sticker_idx on public.user_stickers (user_id, has_sticker);
create index user_stickers_repeated_idx on public.user_stickers (user_id, repeated_quantity)
  where repeated_quantity > 0;

-- ---------------------------------------------------------------------------
-- Configuración del álbum (cantidad total, nombre, etc.)
-- ---------------------------------------------------------------------------
create table public.album_config (
  id text primary key default 'mundial-2026',
  name text not null default 'Álbum Mundial 2026',
  total_stickers integer not null default 700,
  updated_at timestamptz not null default now()
);

insert into public.album_config (id, name, total_stickers)
values ('mundial-2026', 'Álbum Mundial 2026', 700)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Triggers: updated_at y perfil al registrarse
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger stickers_set_updated_at
  before update on public.stickers
  for each row execute function public.set_updated_at();

create trigger user_stickers_set_updated_at
  before update on public.user_stickers
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Inicializa filas user_stickers cuando se crea un perfil (opcional, lazy también sirve)
create or replace function public.ensure_user_sticker_rows(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_stickers (user_id, sticker_id, has_sticker, repeated_quantity)
  select p_user_id, s.id, false, 0
  from public.stickers s
  on conflict (user_id, sticker_id) do nothing;
end;
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.stickers enable row level security;
alter table public.user_stickers enable row level security;
alter table public.album_config enable row level security;

-- profiles
create policy "Perfiles visibles para usuarios autenticados"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Usuario edita su propio perfil"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- stickers: lectura pública autenticada; escritura solo admin
create policy "Figuritas visibles para autenticados"
  on public.stickers for select
  to authenticated
  using (true);

create policy "Admin inserta figuritas"
  on public.stickers for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

create policy "Admin actualiza figuritas"
  on public.stickers for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

create policy "Admin elimina figuritas"
  on public.stickers for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- user_stickers
create policy "Colección visible para intercambio"
  on public.user_stickers for select
  to authenticated
  using (true);

create policy "Usuario gestiona su colección"
  on public.user_stickers for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Usuario actualiza su colección"
  on public.user_stickers for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Usuario elimina su colección"
  on public.user_stickers for delete
  to authenticated
  using (auth.uid() = user_id);

-- album_config
create policy "Config visible para autenticados"
  on public.album_config for select
  to authenticated
  using (true);

create policy "Admin actualiza config"
  on public.album_config for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- ---------------------------------------------------------------------------
-- Vista auxiliar para coincidencias (escalable)
-- ---------------------------------------------------------------------------
create or replace view public.user_sticker_summary as
select
  us.user_id,
  s.number as sticker_number,
  s.id as sticker_id,
  us.has_sticker,
  us.repeated_quantity,
  (not us.has_sticker) as is_missing,
  (us.repeated_quantity > 0) as is_duplicate
from public.user_stickers us
join public.stickers s on s.id = us.sticker_id;

grant select on public.user_sticker_summary to authenticated;
