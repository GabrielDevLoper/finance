/*
  Warnings:

  - You are about to drop the column `quantidade` on the `transacoes` table. All the data in the column will be lost.
  - Added the required column `valor` to the `transacoes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transacoes" DROP COLUMN "quantidade",
ADD COLUMN     "valor" DECIMAL(10,2) NOT NULL;
