"use client";
import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { Button } from "@/app/_components/ui/button";

import { TRANSACTION_CATEGORY_LABELS } from "@/app/_constants/transaction";
import EditTransactionButton from "./edit-transaction-button";
import DeleteTransactionButton from "./delete-transaction-button";

import TransactionTypeBadge from "./type-badge";
import { StatusTransacao, Transacoes } from "@prisma/client";
import { toast } from "sonner";
import { updateStatusTransaction } from "../_actions/update-status-transaction";

interface DataTableProps {
  columns: ColumnDef<Transacoes>[];
  data: Transacoes[];
}

export function DataTableTransactionsMobile({ columns, data }: DataTableProps) {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 8,
  });

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(data.length / pagination.pageSize),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  const nextPage = () => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: Math.min(prev.pageIndex + 1, table.getPageCount() - 1),
    }));
  };

  const previousPage = () => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: Math.max(prev.pageIndex - 1, 0),
    }));
  };

  const handleStatusChange = async (
    transactionId: string,
    status: StatusTransacao
  ) => {
    try {
      await updateStatusTransaction({ transactionId, status });
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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  {/* Linha principal */}
                  <TableRow data-state={row.getIsExpanded() ? "expanded" : ""}>
                    {/* Renderização das células */}
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>

                  {/* Linha expandida (detalhes) */}
                  {row.getIsExpanded() && (
                    <TableRow>
                      <TableCell colSpan={row.getVisibleCells().length}>
                        <div className="flex flex-col space-y-2 p-4 bg-muted rounded-md">
                          {/* Competência */}
                          <p>
                            <strong>Competência:</strong> {row.original.mes}-
                            {row.original.ano}
                          </p>

                          {/* Descrição */}
                          <p>
                            <strong>Descrição:</strong> {row.original.nome}
                          </p>

                          {/* Tipo */}
                          <p>
                            <strong>Tipo:</strong>{" "}
                            <TransactionTypeBadge transaction={row.original} />
                          </p>

                          {/* Categoria */}
                          <p>
                            <strong>Categoria:</strong>{" "}
                            {
                              TRANSACTION_CATEGORY_LABELS[
                                row.original.categoria
                              ]
                            }
                          </p>

                          {/* Valor */}
                          <p>
                            <strong>Valor:</strong>{" "}
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(Number(row.original.valor))}
                          </p>

                          {/* Status Pagamento */}
                          <p>
                            <strong>Status Pagamento:</strong>
                            <div className="flex space-x-2 mt-2">
                              <Button
                                variant={
                                  row.original.status === StatusTransacao.PAGO
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() =>
                                  handleStatusChange(
                                    row.original.id,
                                    StatusTransacao.PAGO
                                  )
                                }
                              >
                                Pago
                              </Button>
                              <Button
                                variant={
                                  row.original.status ===
                                  StatusTransacao.RECEBIDO
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() =>
                                  handleStatusChange(
                                    row.original.id,
                                    StatusTransacao.RECEBIDO
                                  )
                                }
                              >
                                Recebido
                              </Button>
                              <Button
                                variant={
                                  row.original.status ===
                                  StatusTransacao.PENDENTE
                                    ? "default"
                                    : "outline"
                                }
                                className={
                                  row.original.status ===
                                  StatusTransacao.PENDENTE
                                    ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                    : ""
                                }
                                size="sm"
                                onClick={() =>
                                  handleStatusChange(
                                    row.original.id,
                                    StatusTransacao.PENDENTE
                                  )
                                }
                              >
                                Pendente
                              </Button>
                            </div>
                          </p>

                          {/* Data Pagamento */}
                          <p>
                            <strong>Data Pagamento:</strong>{" "}
                            {row.original.data_pagamento
                              ? new Date(
                                  row.original.data_pagamento
                                ).toLocaleDateString("pt-BR", {
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                })
                              : "Não informada"}
                          </p>

                          {/* Ações */}
                          <div className="flex space-x-2">
                            <EditTransactionButton transaction={row.original} />
                            <DeleteTransactionButton
                              transactionId={row.original.id}
                            />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} linha(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={previousPage}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={!table.getCanNextPage()}
          >
            Próximo
          </Button>
        </div>
      </div>
    </>
  );
}
