"use client";

import { Badge } from "@/app/_components/ui/badge";
import { Transacoes } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { CircleIcon } from "lucide-react";
import TransactionTypeBadge from "../_components/type-badge";

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
    cell: () => {
      <Badge className="text-yellow-300 bg-yellow-300 bg-opacity-10 font-bold hover:bg-muted">
        <CircleIcon className="fill-yellow-300 mr-2" size={10} />
        row
      </Badge>;
    },
  },
  {
    accessorKey: "valor",
    header: "Valor",
  },
  {
    accessorKey: "status",
    header: "Status Pagamento",
  },
  {
    accessorKey: "data_pagamento",
    header: "Data Pagamento",
  },
  {
    accessorKey: "acoes",
    header: "Ações",
  },
];
