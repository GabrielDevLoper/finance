import { db } from "@/app/_lib/prisma";
import { StatusTransacao, TipoTransacao } from "@prisma/client";

export interface TransactionsProps {
  searchParams: {
    month: string;
    year: string;
    status: string;
    type: string;
  };
}

// Função assíncrona para buscar dados no servidor
export const fetchTransactions = async (
  searchParams: TransactionsProps["searchParams"],
  userId: string
) => {
  const { month, year, status, type: tipo } = searchParams;

  const transactions = await db.transacoes.findMany({
    where: {
      id_usuario: userId,
      ...(month && { mes: month }),
      ...(year && { ano: year }),
      ...(status && { status: status as StatusTransacao }),
      ...(tipo && { tipo: tipo as TipoTransacao }),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return transactions;
};
