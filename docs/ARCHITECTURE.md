# Arquitectura — Álbum Mundial 2026

## Visión del MVP

Aplicación web **exclusiva** para el intercambio de figuritas físicas del Álbum del Mundial 2026. Cada usuario gestiona su colección (pegadas + repetidas) y la plataforma sugiere intercambios convenientes comparando faltantes y repetidas con otros coleccionistas de la misma zona.

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend | Next.js 16 (App Router), React 19, Tailwind CSS 4 |
| Backend / DB / Auth | Supabase (PostgreSQL + Auth + RLS) |
| Deploy | Vercel |

## Estructura de carpetas

```
album-mundial/
├── docs/ARCHITECTURE.md          # Este documento
├── supabase/
│   ├── migrations/001_initial_schema.sql
│   └── seed.sql                  # Figuritas numeradas 1..N
├── src/
│   ├── app/
│   │   ├── (auth)/               # Login y registro
│   │   ├── (app)/                # Rutas protegidas con shell
│   │   ├── auth/callback/        # OAuth / magic link callback
│   │   └── actions/              # Server Actions
│   ├── components/               # UI por dominio
│   ├── lib/
│   │   ├── data/                 # Acceso a datos (server)
│   │   ├── supabase/             # Clientes browser/server/middleware
│   │   └── matches.ts            # Lógica de coincidencias
│   └── types/database.ts
└── middleware.ts                 # Sesión + rutas públicas
```

## Modelo de datos

El modelo sugerido se implementa con convenciones de Supabase:

| Concepto MVP | Tabla real | Notas |
|--------------|------------|-------|
| `users` | `profiles` | 1:1 con `auth.users`, creado por trigger al registrarse |
| `stickers` | `stickers` | Catálogo del álbum; puede tener solo `number` al inicio |
| `user_stickers` | `user_stickers` | Estado por usuario: `has_sticker`, `repeated_quantity` |
| — | `album_config` | Total de figuritas y nombre del álbum (MVP único) |

### Diagrama ER (simplificado)

```mermaid
erDiagram
  auth_users ||--|| profiles : "id"
  profiles ||--o{ user_stickers : "user_id"
  stickers ||--o{ user_stickers : "sticker_id"
  album_config ||.. stickers : "total_stickers guía seed"
```

### Reglas de negocio

- **Faltante**: `has_sticker = false`
- **Repetida**: `repeated_quantity > 0`
- **Coincidencia directa**: mis faltantes ∩ sus repetidas
- **Coincidencia inversa**: mis repetidas ∩ sus faltantes
- **Score**: suma de figuritas en ambos sentidos del intercambio

## Rutas principales

| Ruta | Descripción |
|------|-------------|
| `/login` | Inicio de sesión |
| `/register` | Registro |
| `/auth/callback` | Callback de Supabase Auth |
| `/album` | Mi álbum — grilla editable |
| `/album/faltantes` | Solo figuritas no pegadas |
| `/album/repetidas` | Solo figuritas con repetidas |
| `/coincidencias` | Matches por provincia/localidad |
| `/usuarios` | Buscador de coleccionistas |
| `/perfil` | Datos de contacto y ubicación |
| `/admin/figuritas` | Panel admin (requiere `is_admin`) |

## Componentes principales

| Componente | Responsabilidad |
|------------|-----------------|
| `AppShell` + `MainNav` | Layout autenticado y navegación |
| `StickerGrid` / `StickerCard` | Grilla del álbum con búsqueda y edición |
| `AlbumStats` | Progreso, faltantes, repetidas |
| `ProfileForm` | Perfil (nombre, ciudad, provincia, contacto) |
| `UserSearchForm` / `UserCard` | Búsqueda y listado de usuarios |
| `MatchCard` | Coincidencias + botón WhatsApp |
| `StickerAdminPanel` | CRUD figuritas y seed numerado |

## Flujo de autenticación

1. Usuario se registra → `auth.users` + trigger → `profiles`
2. Middleware valida sesión en rutas `(app)/*`
3. Tras registro redirige a `/perfil` para completar ubicación y contacto

## Seguridad (RLS)

- `profiles`: lectura para autenticados; edición solo propia fila
- `stickers`: lectura autenticados; escritura solo `is_admin = true`
- `user_stickers`: lectura global (necesaria para matches); escritura solo propia
- `album_config`: lectura autenticados; update admin

## Coincidencias — algoritmo

Implementado en `src/lib/matches.ts`:

1. Construir sets `missing` y `duplicates` por número de figurita
2. Para cada otro usuario, intersectar:
   - `theyHaveWhatINeed = myMissing ∩ theirDuplicates`
   - `iHaveWhatTheyNeed = myDuplicates ∩ theirMissing`
3. Ordenar por `score` descendente

**Escalabilidad futura**: mover a función SQL/RPC o materialized view `user_sticker_summary` (ya creada como vista) con índices por provincia.

## Figuritas sin datos reales

El seed crea figuritas `#1` … `#N` sin `team` ni `player_name`. El admin puede completar metadatos después sin romper colecciones existentes (`sticker_id` estable por UUID).

## Deploy (Vercel)

1. Conectar repo en Vercel
2. Variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. En Supabase → Authentication → URL Configuration: Site URL y redirect URLs de producción
4. Ejecutar migración + seed en Supabase SQL Editor

## Primer admin

```sql
update public.profiles
set is_admin = true
where email = 'tu@email.com';
```

## Próximos pasos (post-MVP)

- Notificaciones / favoritos de intercambio
- Filtro por sección del álbum
- RPC `get_trade_matches(province, city)` en Postgres
- PWA offline para marcar figuritas en la calle
- Imágenes de figuritas en Storage de Supabase
