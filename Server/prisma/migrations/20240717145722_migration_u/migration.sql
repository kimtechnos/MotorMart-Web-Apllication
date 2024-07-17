-- CreateTable
CREATE TABLE "users_table" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "users_table_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_table_email_key" ON "users_table"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_table_phoneNumber_key" ON "users_table"("phoneNumber");
