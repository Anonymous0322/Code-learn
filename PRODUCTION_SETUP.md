# Production setup: GitHub, Vercel, and Supabase

The web app is deployed from `apps/web`. Supabase stores authentication, course content, profiles, learning progress, and learner submissions. Firebase is not used by the web app. Existing Firebase users and data are not migrated.

## 1. Create and configure Supabase

1. Create a Supabase project and save its database password somewhere secure.
2. In **SQL Editor**, run the migration files in `supabase/migrations` in chronological order. For an existing database, run only the migrations that have not already been applied; do not rerun the initial schema migration.
3. In **Project Settings → API**, copy the project URL and the publishable/anon key. The browser uses only these public values; never use a `service_role` key in the app or Vercel client environment.
4. In **Authentication → URL Configuration**, set the site URL to the Vercel production URL and add the production and local development URLs to the redirect URL allow-list.
5. Register your account and confirm its email if confirmation is enabled. In **Authentication → Users**, copy your account's UUID (Auth UID). In the SQL Editor, verify it is your account and promote its profile:

   ```sql
   select id, email, role
   from public.profiles
   where id = 'AUTH_USER_UUID';

   update public.profiles
   set role = 'creator'
   where id = 'AUTH_USER_UUID';

   select id, email, role
   from public.profiles
   where id = 'AUTH_USER_UUID';
   ```

   The result should show `role = 'creator'`. Sign out and sign back in to refresh the role in the app; the admin panel is at `/admin`. The creator can then grant `admin` roles from the admin panel. Creator roles are intentionally assigned only from the Supabase SQL Editor, not through the app. An email address alone never grants admin access.

## 2. Run locally

From `apps/web`, copy `.env.example` to `.env.local` and fill in the Supabase values:

```text
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-or-anon-key
```

Then install and run:

```powershell
npm ci
npm run dev
```

The first sign-up may require email confirmation depending on the Supabase Auth settings.

## 3. Deploy with GitHub and Vercel

1. Push the repository to GitHub.
2. Import it in Vercel and set the **Root Directory** to `apps/web`.
3. Add `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as Vercel environment variables for Preview and Production.
4. Deploy. Vercel runs the Next.js build and creates preview deployments for branches and pull requests.
5. Add the Vercel production domain (and any custom domain) to Supabase Authentication's redirect URL allow-list. Update `NEXT_PUBLIC_SITE_URL` to the final public URL and redeploy.

## Data and permissions

Admin course and lesson changes are saved to the Supabase `courses` table and are shared across deployments. The migration enables row-level security: published courses are public-readable; only admins can manage courses; learner records are scoped to their authenticated owner; admins can review lesson feedback. The `get_public_portfolio` RPC exposes only portfolios explicitly marked public.

Apply future SQL migrations to the Supabase project before deploying app code that depends on them. Do not commit `.env.local` or service-role credentials.
