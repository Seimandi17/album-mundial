# Álbum Mundial 2026

Plataforma web para **intercambiar figuritas físicas** del Álbum del Mundial 2026. Gestioná tu colección, encontrá coleccionistas de tu zona y coordiná intercambios por WhatsApp o Instagram.

## Stack

- **Next.js** (App Router)
- **Tailwind CSS**
- **Supabase** (PostgreSQL + Auth)
- **Vercel** (deploy)

## Inicio rápido

### 1. Clonar e instalar

```bash
npm install
cp .env.local.example .env.local
```

Completá `.env.local` con las credenciales de tu proyecto Supabase.

### 2. Base de datos

En el [SQL Editor de Supabase](https://supabase.com/dashboard):

1. Ejecutá `supabase/migrations/001_initial_schema.sql`
2. Ejecutá `supabase/seed.sql` (genera figuritas del 1 al total configurado, por defecto 700)

### 3. Primer administrador

```sql
update public.profiles
set is_admin = true
where email = 'tu@email.com';
```

Desde `/admin/figuritas` podés ajustar el total, generar figuritas numeradas y editar equipos/jugadores cuando estén definidos.

### 4. Desarrollo local

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Rutas

| Ruta | Función |
|------|---------|
| `/album` | Mi álbum — marcar pegadas y repetidas |
| `/album/faltantes` | Figuritas que me faltan |
| `/album/repetidas` | Mis repetidas |
| `/coincidencias` | Intercambios sugeridos |
| `/usuarios` | Buscar por provincia/localidad |
| `/perfil` | Datos de contacto |
| `/admin/figuritas` | Panel admin |

## Documentación

Ver [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) para arquitectura, modelo de datos y decisiones técnicas.

## Deploy en Vercel

1. Importá el repositorio en Vercel
2. Agregá las variables de entorno de Supabase
3. Configurá en Supabase Auth las URLs de producción (`https://tu-dominio.vercel.app`)

## Licencia

Proyecto privado — uso personal / MVP.
