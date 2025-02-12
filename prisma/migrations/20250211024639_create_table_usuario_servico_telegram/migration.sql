-- CreateTable
CREATE TABLE "usuario_servico_telegram" (
    "id" TEXT NOT NULL,
    "id_usuario_clerk" TEXT,
    "id_usuario_telegram" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuario_servico_telegram_pkey" PRIMARY KEY ("id")
);
