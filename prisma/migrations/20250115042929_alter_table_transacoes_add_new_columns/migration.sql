-- AlterTable
ALTER TABLE "transacoes" ADD COLUMN     "ano" TEXT,
ADD COLUMN     "mes" TEXT,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDENTE';
