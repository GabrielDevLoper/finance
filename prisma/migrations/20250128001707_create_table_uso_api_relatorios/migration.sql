-- CreateTable
CREATE TABLE "uso_api_relatorios" (
    "id" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "quantidade_chamadas" INTEGER NOT NULL DEFAULT 0,
    "ia_descricao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "uso_api_relatorios_pkey" PRIMARY KEY ("id")
);
