-- CreateTable
CREATE TABLE "table_cars" (
    "id" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "table_cars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "table_inquiries" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "table_inquiries_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "table_cars" ADD CONSTRAINT "table_cars_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users_table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "table_inquiries" ADD CONSTRAINT "table_inquiries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users_table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "table_inquiries" ADD CONSTRAINT "table_inquiries_carId_fkey" FOREIGN KEY ("carId") REFERENCES "table_cars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
