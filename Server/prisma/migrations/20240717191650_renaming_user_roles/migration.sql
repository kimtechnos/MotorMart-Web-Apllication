-- AlterTable
ALTER TABLE "users_table" ALTER COLUMN "role" DROP NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'user';
