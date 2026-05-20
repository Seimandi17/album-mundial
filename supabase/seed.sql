-- Seed: figuritas numeradas del 1 al total configurado (sin nombres reales aún)
-- Ajustá total_stickers en album_config antes de ejecutar si hace falta.

do $$
declare
  total integer;
  n integer;
begin
  select total_stickers into total from public.album_config where id = 'mundial-2026';
  if total is null then
    total := 700;
  end if;

  for n in 1..total loop
    insert into public.stickers (number, team, player_name, section)
    values (n, null, null, null)
    on conflict (number) do nothing;
  end loop;
end;
$$;
