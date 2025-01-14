/*
  Warnings:

  - The values [CASA,FIXA,VARIAVEL,OUTROS] on the enum `CategoriaTransacao` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CategoriaTransacao_new" AS ENUM ('TRANSPORTE', 'EDUCACAO', 'SAUDE', 'LAZER', 'MORADIA', 'ALIMENTACAO', 'SALARIO', 'FINANCIAMENTO', 'FINANCEIRO', 'FREELANCER', 'FATURA_CARTAO_CREDITO');
ALTER TABLE "transacoes" ALTER COLUMN "categoria" TYPE "CategoriaTransacao_new" USING ("categoria"::text::"CategoriaTransacao_new");
ALTER TYPE "CategoriaTransacao" RENAME TO "CategoriaTransacao_old";
ALTER TYPE "CategoriaTransacao_new" RENAME TO "CategoriaTransacao";
DROP TYPE "CategoriaTransacao_old";
COMMIT;
