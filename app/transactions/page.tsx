import { db } from "../_lib/prisma";
import { DataTable } from "../_components/ui/data-table";
import { transactionsColumns } from "./_columns";
import AddTransactionButton from "../_components/add-transaction-button";
import Navbar from "../_components/navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { MONTHS_OPTIONS_LABEL } from "../_constants/utils";
import FilterTransaction from "./_components/filter-transaction";
import { canUserAddTransaction } from "../_data/can-user-add-transaction";
import { StatusTransacao, TipoTransacao } from "@prisma/client";

interface TransactionsProps {
  searchParams: {
    month: string;
    year: string;
    status: string;
    type: string;
  };
}

const Transactions = async ({ searchParams }: TransactionsProps) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

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
      createdAt: "desc", // ou 'createdAt', dependendo do campo que você usa
    },
  });

  const canUserAddTransactions = await canUserAddTransaction();

  return (
    <>
      <Navbar />
      <div className="p-6 space-y-6">
        <div className="flex w-full justify-between items-center">
          <h1 className="font-bold text-2xl">
            Transações de {MONTHS_OPTIONS_LABEL.get(month) ?? ""} de {year}
          </h1>
          <FilterTransaction />
          <AddTransactionButton
            userCanAddTransaction={canUserAddTransactions}
          />
        </div>
        <DataTable
          columns={transactionsColumns}
          data={JSON.parse(JSON.stringify(transactions))}
        />
      </div>
    </>
  );
};

export default Transactions;
