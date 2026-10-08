# Supabase keep-alive

A GitHub Actions workflow runs a daily `SELECT` against a dedicated `public.keep_alive` table through the Supabase REST API. That creates real database activity even when nobody visits MotorMart.

Regular pings may reduce inactivity pausing on the Supabase Free plan. They are **not** a guarantee that the project will stay unpaused.

## How it works

1. Prisma migration `20261008120000_add_keep_alive` creates `public.keep_alive` with one row (`id = 1`).
2. Row Level Security is on. Only `SELECT` is allowed for the `anon` and `authenticated` roles. There are no public insert, update, or delete policies.
3. Workflow `.github/workflows/supabase-keep-alive.yml` runs every day at 08:00 UTC (11:00 AM Kenya time) and can also be started by hand. GitHub only runs scheduled workflows from the repository **default branch**. Merge this file there before the daily ping will fire.
4. The job calls `GET /rest/v1/keep_alive?select=id,last_ping&id=eq.1`. A publishable key (`sb_publishable_...`) is sent only on the `apikey` header. A legacy JWT anon key is sent on both `apikey` and `Authorization`. It retries transient failures and fails on HTTP errors.

The React app never calls this table. No Vercel serverless function is involved.

## Apply the migration

From `Server/`, with `DATABASE_URL` pointing at the hosted Postgres database:

```bash
npx prisma migrate deploy
```

Render already runs that command on API deploys, so pushing this migration is enough for production if the API build succeeds.

To apply the SQL by hand in the Supabase SQL editor, run the contents of:

`Server/prisma/migrations/20261008120000_add_keep_alive/migration.sql`

Then, in GitHub, mark the migration as applied only if Prisma did not record it. Prefer `prisma migrate deploy` when you can.

## GitHub repository secrets

In the GitHub repo: **Settings → Secrets and variables → Actions → New repository secret**.

| Secret | Value |
| --- | --- |
| `SUPABASE_URL` | `https://<project-ref>.supabase.co` from **Settings → General** (Project ID) or **Connect**. No trailing slash. |
| `SUPABASE_ANON_KEY` | **API Keys → Publishable key** (`sb_publishable_...`), or the legacy **anon** JWT. |

Do not store a **Secret** / `sb_secret_` / `service_role` key. Do not put either value in the React client or in git.

## Run the workflow by hand

1. Open the GitHub repo → **Actions**.
2. Select **Supabase keep-alive**.
3. Click **Run workflow** → **Run workflow**.

GitHub emails the repository owner or watchers when a workflow fails, if notifications are enabled. That is the monitoring path: execution history, green/red status, and failure mail. There is no frontend polling.

## Verify a successful run

A good run shows:

- Step **Query public.keep_alive**
- `HTTP 200`
- A JSON array such as `[{"id":1,"last_ping":"..."}]`
- `Keep-alive succeeded.`

Confirm in **Actions** that the latest scheduled or manual run is green.

## Troubleshoot

| Symptom | Likely cause |
| --- | --- |
| `Missing repository secrets` | `SUPABASE_URL` or `SUPABASE_ANON_KEY` is not set. |
| HTTP 400 Invalid JWT | Publishable key was sent as `Authorization: Bearer`. Use the updated workflow, which puts `sb_publishable_...` on `apikey` only. |
| HTTP 401 / 403 | Wrong publishable/anon key, or the URL is not this project. |
| HTTP 404 | Table is missing, or the REST path is wrong. Apply the migration. |
| HTTP 200 with an empty array | Row `id = 1` was not inserted. Re-run the migration SQL. |
| HTTP 503 `PGRST002` | PostgREST cannot read the schema cache. In Supabase **Settings → General**, click **Restart project** (not Pause), wait two minutes, then re-run the workflow. |
| Timeout / HTTP 000 | Network issue, paused project, or wrong host. Retry; check the Supabase dashboard. |

The workflow prints the request host and response body. It does not print secrets or authorization headers.

## Disable the automation

1. GitHub → **Actions** → **Supabase keep-alive** → **...** → **Disable workflow**.
2. Or delete `.github/workflows/supabase-keep-alive.yml`.

The `keep_alive` table can stay in the database; it is unused by the app. To remove it, add a later Prisma migration that drops the table and the `KeepAlive` model.
