"use client";

import { Badge } from "@/app/_components/ui/badge";
import { CategoriaTransacao, Transacoes } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { CircleIcon, PencilIcon, TrashIcon } from "lucide-react";
import TransactionTypeBadge from "../_components/type-badge";
import { Button } from "@/app/_components/ui/button";

const TRANSACTION_CATEGORY_LABELS = {
  [CategoriaTransacao.ALIMENTACAO]: "Alimentação",
  [CategoriaTransacao.CASA]: "Casa",
  [CategoriaTransacao.EDUCACAO]: "Educação",
  [CategoriaTransacao.FATURA_CARTAO_CREDITO]: "Fatura Cartão de Crédito",
  [CategoriaTransacao.FINANCEIRO]: "Financeiro",
  [CategoriaTransacao.FINANCIAMENTO]: "Financiamento",
  [CategoriaTransacao.FIXA]: "Fixa",
  [CategoriaTransacao.FREELANCER]: "Freelancer",
  [CategoriaTransacao.LAZER]: "Lazer",
  [CategoriaTransacao.OUTROS]: "Outros",
  [CategoriaTransacao.SALARIO]: "Salário",
  [CategoriaTransacao.SAUDE]: "Saúde",
  [CategoriaTransacao.TRANSPORTE]: "Transporte",
  [CategoriaTransacao.VARIAVEL]: "Variável",
};

export const transactionsColumns: ColumnDef<Transacoes>[] = [
  {
    accessorKey: "nome",
    header: "Nome",
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
    cell: ({ row: { original: transaction } }) => (
      <TransactionTypeBadge transaction={transaction} />
    ),
  },
  {
    accessorKey: "categoria",
    header: "Categoria",
    cell: ({ row: { original: transaction } }) => (
      <Badge className="text-white bg-white bg-opacity-10 font-bold hover:bg-muted">
        <CircleIcon className="fill-white mr-2" size={10} />
        {TRANSACTION_CATEGORY_LABELS[transaction.categoria]}
      </Badge>
    ),
  },
  {
    accessorKey: "valor",
    header: "Valor",

    cell: ({ row: { original: transaction } }) =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Number(transaction.valor)),
  },
  {
    accessorKey: "status",
    header: "Status Pagamento",
    cell: ({ row: { original: transaction } }) => {
      if (transaction.status === "PAGO") {
        return (
          <Badge className="bg-muted text-primary hover:bg-muted font-bold">
            <CircleIcon className="fill-primary mr-2" size={10} />
            Pago
          </Badge>
        );
      }

      return (
        <Badge className="bg-muted text-yellow-300 hover:bg-muted font-bold">
          <CircleIcon className="fill-yellow-300 mr-2" size={10} />
          Pendente
        </Badge>
      );
    },
  },
  {
    accessorKey: "data_pagamento",
    header: "Data Pagamento",
    cell: ({ row: { original: transaction } }) =>
      new Date(transaction.data_pagamento).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
  },
  {
    accessorKey: "acoes",
    header: "Ações",
    cell: () => {
      return (
        <div>
          <Button
            variant="ghost"
            size={"icon"}
            className="text-muted-foreground space-x-1"
          >
            <TrashIcon />
          </Button>

          <Button
            variant="ghost"
            size={"icon"}
            className="text-muted-foreground space-x-1"
          >
            <PencilIcon />
          </Button>
        </div>
      );
    },
  },
];
