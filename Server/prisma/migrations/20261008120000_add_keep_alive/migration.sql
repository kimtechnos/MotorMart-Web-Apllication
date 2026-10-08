-- Dedicated ping target for scheduled keep-alive. Not used by MotorMart product flows.
CREATE TABLE IF NOT EXISTS "keep_alive" (
    "id" INTEGER NOT NULL,
    "last_ping" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "keep_alive_pkey" PRIMARY KEY ("id")
);

INSERT INTO "keep_alive" ("id")
VALUES (1)
ON CONFLICT ("id") DO NOTHING;

ALTER TABLE "keep_alive" ENABLE ROW LEVEL SECURITY;

-- anon/authenticated exist on Supabase, not on the CI Postgres service.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon')
     AND EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    EXECUTE 'DROP POLICY IF EXISTS "keep_alive_select_public" ON "keep_alive"';
    EXECUTE 'CREATE POLICY "keep_alive_select_public" ON "keep_alive" FOR SELECT TO anon, authenticated USING (true)';
    EXECUTE 'GRANT SELECT ON TABLE "keep_alive" TO anon, authenticated';
  END IF;
END
$$;
