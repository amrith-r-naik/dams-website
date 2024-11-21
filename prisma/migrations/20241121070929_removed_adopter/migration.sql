/*
  Warnings:

  - You are about to drop the column `adopterId` on the `Adoption` table. All the data in the column will be lost.
  - You are about to drop the column `breed` on the `Dog` table. All the data in the column will be lost.
  - The `imageUrl` column on the `Dog` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `adopterId` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `adopterId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Shelter` table. All the data in the column will be lost.
  - You are about to drop the `Adopter` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[staffId]` on the table `Shelter` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Adoption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Favorite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `staffId` to the `Shelter` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Adopter" DROP CONSTRAINT "Adopter_userId_fkey";

-- DropForeignKey
ALTER TABLE "Adoption" DROP CONSTRAINT "Adoption_adopterId_fkey";

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_adopterId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_recipientId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_adopterId_fkey";

-- DropForeignKey
ALTER TABLE "Shelter" DROP CONSTRAINT "Shelter_userId_fkey";

-- DropIndex
DROP INDEX "Shelter_userId_key";

-- AlterTable
ALTER TABLE "Adoption" DROP COLUMN "adopterId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Dog" DROP COLUMN "breed",
ADD COLUMN     "breedId" INTEGER,
DROP COLUMN "imageUrl",
ADD COLUMN     "imageUrl" TEXT[];

-- AlterTable
ALTER TABLE "Favorite" DROP COLUMN "adopterId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "adopterId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Shelter" DROP COLUMN "userId",
ADD COLUMN     "staffId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Adopter";

-- CreateTable
CREATE TABLE "DogBreed" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "countryOfOrigin" TEXT,
    "furColor" TEXT,
    "height" TEXT,
    "eyeColor" TEXT,
    "longevity" TEXT,
    "characterTraits" TEXT,
    "commonHealthProblems" TEXT,
    "imageUrl" TEXT,

    CONSTRAINT "DogBreed_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DogBreed_name_key" ON "DogBreed"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Shelter_staffId_key" ON "Shelter"("staffId");

-- AddForeignKey
ALTER TABLE "Shelter" ADD CONSTRAINT "Shelter_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dog" ADD CONSTRAINT "Dog_breedId_fkey" FOREIGN KEY ("breedId") REFERENCES "DogBreed"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adoption" ADD CONSTRAINT "Adoption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
