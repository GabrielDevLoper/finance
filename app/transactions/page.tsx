import { db } from "../_lib/prisma";
import { DataTable } from "../_components/ui/data-table";
import { transactionsColumns } from "./_columns";
import AddTransactionButton from "../_components/add-transaction-button";
import Navbar from "../_components/navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { MONTHS_OPTIONS_LABEL } from "../_constants/utils";
import FilterTransaction from "./_components/filter-transaction";

interface TransactionsProps {
  searchParams: {
    month?: string;
    year?: string;
    status?: string;
    type?: string;
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
      ...(status && { status }), // Adicionando o filtro por categoria, se presente
      ...(tipo && { tipo }), // Adicionando o filtro por categoria, se presente
    },
    orderBy: {
      createdAt: "desc", // ou 'createdAt', dependendo do campo que você usa
    },
  });

  return (
    <>
      <Navbar />
      <div className="p-6 space-y-6">
        <div className="flex w-full justify-between items-center">
          <h1 className="font-bold text-2xl">
            Transações de {MONTHS_OPTIONS_LABEL[month] ?? ""} de {year}
          </h1>
          <FilterTransaction />
          <AddTransactionButton />
        </div>
        <DataTable columns={transactionsColumns} data={transactions} />
      </div>
    </>
  );
};

export default Transactions;
