## CyberWorld Gateway

Next.js App Router project that powers the CyberWorld authentication gateway. Supabase Auth provides login and registration, backed by the Supabase local development stack for testing.

### Prerequisites

- Node.js 20.9+ (project developed with Node 25 via `nvm`)
- Docker (required for the Supabase local stack)
- GitHub CLI authentication (for pushes)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and fill in the Supabase keys once the local stack is running (step 3):

```bash
cp env.example .env.local
```

The local Supabase CLI will print the `anon`, `service_role`, and JWT secret. Paste them into `.env.local`.

### 3. Start the Supabase development stack

The project uses the Supabase CLI (run via `npx`). The helper scripts keep everything in sync:

```bash
# start postgres, auth, studio, etc.
npm run supabase:start

# in a second terminal you can inspect the stack
npm run supabase:stop   # when you are finished
```

On the first run the CLI initialises `supabase/config.toml` and seeds the database with defaults. The auth site URL is set to `http://127.0.0.1:3000` to match the Next.js dev server.

### 4. Launch the Next.js app

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the gateway. The UI exposes:

- `/login` – Supabase email/password login using server actions
- `/register` – registration flow that immediately signs the user in (no email confirmation locally)
- `/dashboard` – protected route guarded by `middleware.ts`

### Testing the auth flow

1. With Supabase running, open `/register` and create a user.
2. You should land on `/dashboard` and see your Supabase user ID/email.
3. Sign out to clear the auth cookies, then try `/dashboard` again to confirm the redirect back to `/login`.

You can inspect emails sent by Supabase (magic links, resets) at [http://localhost:54324](http://localhost:54324) via the bundled Inbucket UI.

### Database migrations

The Supabase CLI is already initialised (`supabase/` directory). Use the standard workflow when modelling product schemas:

```bash
npx supabase migration new add_product_schema
# edit the generated SQL then
npx supabase db reset      # apply locally
npx supabase db diff -f schema.sql
```

### Useful references

- [Supabase Auth with Next.js App Router](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Supabase CLI local development guide](https://supabase.com/docs/guides/local-development/overview)
- [Next.js Middleware documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
