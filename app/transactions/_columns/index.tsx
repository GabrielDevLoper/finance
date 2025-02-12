"use client";

import { Badge } from "@/app/_components/ui/badge";
import { StatusTransacao, Transacoes } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { CircleIcon } from "lucide-react";
import TransactionTypeBadge from "../_components/type-badge";

import { TRANSACTION_CATEGORY_LABELS } from "@/app/_constants/transaction";
import EditTransactionButton from "../_components/edit-transaction-button";
import DeleteTransactionButton from "../_components/delete-transaction-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { toast } from "sonner";

import { updateStatusTransaction } from "../_actions/update-status-transaction";

export const transactionsColumns: ColumnDef<Transacoes>[] = [
  {
    accessorKey: "ano",
    header: "Competência",
    cell: ({ row: { original: transaction } }) => (
      <Badge className="text-white bg-white bg-opacity-10 font-bold hover:bg-muted">
        <CircleIcon className="fill-white mr-2" size={10} />
        {transaction.mes}-{transaction.ano}
      </Badge>
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
      const handleStatusChange = async (status: StatusTransacao) => {
        try {
          await updateStatusTransaction({
            transactionId: transaction.id,
            status,
          });
          toast.success(`Status atualizado com sucesso ✔️`, {
            className: "bg-[#55B02E] text-white border-none",
          });
        } catch (error) {
          console.error("Erro ao atualizar o status:", error);
          toast.error("Erro ao atualizar o status. Tente novamente.");
        }
      };

      return (
        <>
          <Select
            value={transaction.status || StatusTransacao.PENDENTE} // Fallback para "PENDENTE"
            onValueChange={(value: StatusTransacao) => {
              handleStatusChange(value);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={StatusTransacao.PAGO}>
                <Badge className="bg-muted text-primary hover:bg-muted font-bold">
                  <CircleIcon className="fill-primary mr-2" size={10} />
                  Pago
                </Badge>
              </SelectItem>
              <SelectItem value={StatusTransacao.RECEBIDO}>
                <Badge className="bg-muted text-primary hover:bg-muted font-bold">
                  <CircleIcon className="fill-primary mr-2" size={10} />
                  Recebido
                </Badge>
              </SelectItem>
              <SelectItem value={StatusTransacao.PENDENTE}>
                <Badge className="bg-muted text-yellow-300 hover:bg-muted font-bold">
                  <CircleIcon className="fill-yellow-300 mr-2" size={10} />
                  Pendente
                </Badge>
              </SelectItem>
            </SelectContent>
          </Select>
        </>
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

          <DeleteTransactionButton transactionId={transaction.id} />
        </div>
      );
    },
  },
];
