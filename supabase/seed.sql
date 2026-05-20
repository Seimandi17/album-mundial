-- Seed: figuritas numeradas del 1 al total configurado.
-- El álbum Panini FIFA World Cup 2026 tiene 980 figuritas.
-- Este seed NO inventa jugadores/equipos: solo asegura la numeración base.

do $$
declare
  total integer;
  n integer;
begin
  select total_stickers into total from public.album_config where id = 'mundial-2026';
  if total is null then
    total := 980;
  end if;

  for n in 1..total loop
    insert into public.stickers (number, team, player_name, section, sticker_type)
    values (n, null, null, null, 'numbered')
    on conflict (number) do nothing;
  end loop;
end;
$$;
