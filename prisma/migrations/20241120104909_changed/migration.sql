/*
  Warnings:

  - You are about to drop the column `size` on the `Dog` table. All the data in the column will be lost.
  - Added the required column `description` to the `Dog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dog" DROP COLUMN "size",
ADD COLUMN     "description" TEXT NOT NULL;
