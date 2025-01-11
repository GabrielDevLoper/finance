-- CreateEnum
CREATE TYPE "StatusTransacao" AS ENUM ('PAGO', 'PENDENTE');

-- CreateEnum
CREATE TYPE "TipoTransacao" AS ENUM ('DEPOSITO', 'DESPESA', 'INVESTIMENTO');

-- CreateEnum
CREATE TYPE "CategoriaTransacao" AS ENUM ('TRANSPORTE', 'EDUCACAO', 'SAUDE', 'LAZER', 'CASA', 'ALIMENTACAO', 'SALARIO', 'FIXA', 'VARIAVEL', 'FINANCIAMENTO', 'FINANCEIRO', 'FREELANCER', 'OUTROS');

-- CreateTable
CREATE TABLE "transacoes" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "TipoTransacao" NOT NULL,
    "quantidade" DECIMAL(10,2) NOT NULL,
    "categoria" "CategoriaTransacao" NOT NULL,
    "status" "StatusTransacao" NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "data_pagamento" TIMESTAMP(3) NOT NULL,
    "observacao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transacoes_pkey" PRIMARY KEY ("id")
);
