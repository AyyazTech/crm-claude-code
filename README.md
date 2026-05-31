# CRM — Built with Claude Code

A complete CRM web app built end to end with **Claude Code** on the [AyyazTech](https://www.youtube.com/@AyyazTech) YouTube channel. Not a toy — it has real auth, a contacts manager, a drag-and-drop deal pipeline, and a live dashboard.

🔔 **Subscribe for more:** https://www.youtube.com/@AyyazTech
🌐 **More tutorials:** https://ayyaztech.com

<!-- VIDEO_LINK -->

## Features

- 🔐 **Login** — simple username + password auth (hashed passwords, server sessions)
- 👥 **Contacts** — create, edit, delete, with company and status
- 📊 **Deal pipeline** — drag-and-drop Kanban (Lead → Contacted → Proposal → Won/Lost) with deal values
- 📈 **Dashboard** — total contacts, deals by stage, pipeline value, and a revenue-by-month chart

## Tech stack

Next.js 16 (App Router) · Prisma 7 + SQLite (better-sqlite3) · Tailwind CSS 4 · @dnd-kit · TypeScript

## Getting started

Requires Node 20+ and [bun](https://bun.sh) (or use npm).

```bash
# 1. Install dependencies
bun install

# 2. Create your environment file and set a session secret
cp .env.example .env
# generate a secret and paste it into .env as SESSION_SECRET:
openssl rand -base64 32

# 3. Set up the database (creates dev.db, generates the client, applies migrations)
bun run db:migrate

# 4. Seed the demo data (sample contacts, deals, and the demo login)
bun run db:seed

# 5. Run it
bun dev
```

Open http://localhost:3000

### Demo login

```
Username: admin
Password: admin123
```

## How it was built

The whole app was built by prompting Claude Code in stages — foundation and contacts first, then the deal pipeline, the dashboard, and finally login. The UI direction was guided by Claude Code's official frontend-design skill. Watch the full build on the channel above.

## License

MIT — use it, learn from it, build on it.
