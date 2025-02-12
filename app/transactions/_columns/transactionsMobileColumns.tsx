"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Transacoes } from "@prisma/client";
import TransactionTypeBadge from "../_components/type-badge";
import { ChevronDown, ChevronUp } from "lucide-react";

export const transactionsColumnsMobile: ColumnDef<Transacoes>[] = [
  {
    id: "expand",
    header: "",
    cell: ({ row }) => (
      <button
        onClick={() => {
          row.toggleExpanded();
        }}
        className="text-blue-500 hover:text-blue-700"
      >
        {row.getIsExpanded() ? <ChevronUp /> : <ChevronDown />}
      </button>
    ),
  },
  {
    accessorKey: "nome",
    header: "Descrição",
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
    cell: ({ row: { original: transaction } }) => (
      <TransactionTypeBadge transaction={transaction} />
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
];
