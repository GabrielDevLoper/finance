"use client";

import { Badge } from "@/app/_components/ui/badge";
import { Transacoes } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { CircleIcon, TrashIcon } from "lucide-react";
import TransactionTypeBadge from "../_components/type-badge";
import { Button } from "@/app/_components/ui/button";
import { TRANSACTION_CATEGORY_LABELS } from "@/app/_constants/transaction";
import EditTransactionButton from "../_components/edit-transaction-button";

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
    cell: ({ row: { original: transaction } }) => {
      if (transaction.data_pagamento) {
        return new Date(transaction.data_pagamento).toLocaleDateString(
          "pt-BR",
          {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }
        );
      }

      return "";
    },
  },
  {
    accessorKey: "acoes",
    header: "Ações",
    cell: ({ row: { original: transaction } }) => {
      return (
        <div>
          <EditTransactionButton transaction={transaction} />

          <Button
            variant="ghost"
            size={"icon"}
            className="text-muted-foreground space-x-1"
          >
            <TrashIcon />
          </Button>
        </div>
      );
    },
  },
];
