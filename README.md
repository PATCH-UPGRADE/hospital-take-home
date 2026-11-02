# Bugcrowd / PATCH Take-Home Assessment

The application provides a minimal interface to view an asset inventory for hospitals.

- The **asset dashboard** (`/`) lists assets in a searchable, sortable, paginated table, and has a
  **New Asset** dialog for creating one. It sits in an app shell with a collapsible sidebar and a
  top bar with a light/dark theme toggle.
- The **REST API** (`/api/v1`) lists and creates assets. Its interactive docs are at
  [`/docs`](http://localhost:3000/docs), linked from the bottom of the sidebar. The API has no
  authentication.


## Screenshots / Screen-recording

TODO for candidate

<!--Where is your application deployed at?-->

## Design Decisions

TODO for candidate

## Stack

- [Next.js 15](https://nextjs.org) (App Router), React 19, TypeScript (strict)
- [tRPC 11](https://trpc.io) with [TanStack Query](https://tanstack.com/query)
- [trpc-to-openapi](https://github.com/mcampa/trpc-to-openapi) exposes tRPC procedures as REST
  endpoints, with [Scalar](https://scalar.com) rendering the OpenAPI document
- [Prisma 6](https://www.prisma.io) ORM with PostgreSQL
- [shadcn/ui](https://ui.shadcn.com) component library + Tailwind CSS 4
- [nuqs](https://nuqs.47ng.com) for URL state (page, search, sort)
- [Biome](https://biomejs.dev) for lint and format, [Vitest](https://vitest.dev) for tests
- [Inngest](https://www.inngest.com) for background jobs (optional, see below)

## Getting started

Requires Node 20+ and Docker.

```bash
cp .env.example .env
npm install            # also generates the Prisma client
npm run db:up          # starts Postgres on localhost:5432
npm run db:migrate     # applies the migrations
npm run db:seed        # loads sample assets (skipped if assets already exist)
npm run dev
```

Then open http://localhost:3000.

Instead of `npm run dev`, `npm run dev:all` runs the Next.js dev server, the Inngest dev server
and Prisma Studio side by side in [mprocs](https://github.com/pvolok/mprocs) (configured in
`mprocs.yaml`). Postgres still has to be started with `npm run db:up`.

## Background jobs (optional)

Inngest is wired up but has no functions. Using it is optional. We use Inngest for durable background work

- `src/inngest/client.ts` is the Inngest client.
- `src/app/api/inngest/route.ts` serves the functions. Add each new function, from
  `src/inngest/functions/`, to the `functions` array there, or it will never run.
- `npm run inngest:dev` (or `npm run dev:all`) starts the Inngest dev server, with its dashboard at
  http://localhost:8288. It finds the app at http://localhost:3000/api/inngest.

## Project layout

```
prisma/
  schema.prisma              # the Asset model
  seed.ts                    # sample data
src/
  app/
    (dashboard)/layout.tsx   # app shell: sidebar + top bar
    (dashboard)/page.tsx     # asset dashboard
    docs/page.tsx            # Scalar API reference
    api/trpc/[trpc]/         # tRPC endpoint used by the UI
    api/v1/[...trpc]/        # REST endpoints (trpc-to-openapi)
    api/openapi.json/        # generated OpenAPI document
    api/inngest/             # Inngest endpoint (optional)
  features/assets/
    components/              # table columns, create dialog, page sections
    hooks/                   # client data hooks and URL params
    server/routers.ts        # tRPC router: getMany, create
    types.ts                 # zod input and response schemas
  inngest/                   # Inngest client and functions (optional)
  trpc/                      # tRPC init, client provider, server helpers
  components/                # app sidebar, top bar, theme toggle, page-level building blocks
  components/ui/             # shadcn/ui components and the DataTable
  lib/                       # pagination, Prisma client, shared helpers
```

## Scripts

| Script           | Description                       |
| ---------------- | --------------------------------- |
| `npm run dev`    | Dev server (Turbopack)            |
| `npm run dev:all` | Dev server, Inngest dev server and Prisma Studio, via mprocs |
| `npm run inngest:dev` | Inngest dev server (optional) |
| `npm run build`  | Production build                  |
| `npm run lint`   | Biome lint and format check       |
| `npm run format` | Format with Biome                 |
| `npm test`       | Vitest in watch mode (`-- --run` for a single run) |
