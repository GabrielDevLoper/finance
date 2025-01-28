-- CreateTable
CREATE TABLE "relatorios_mensais" (
    "id" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "ano" TEXT NOT NULL,
    "mes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "relatorios_mensais_pkey" PRIMARY KEY ("id")
);
