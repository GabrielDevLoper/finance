import { DataTable } from "../_components/ui/data-table";
import { transactionsColumns } from "./_columns";
import AddTransactionButton from "../_components/add-transaction-button";
import Navbar from "../_components/navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { MONTHS_OPTIONS_LABEL } from "../_constants/utils";
import FilterTransaction from "./_components/filter-transaction";
import { canUserAddTransaction } from "../_data/can-user-add-transaction";
import { Suspense } from "react";

import Loading from "../_components/loading";
import {
  fetchTransactions,
  TransactionsProps,
} from "./_actions/get-transactions";

const Transactions = async ({ searchParams }: TransactionsProps) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const transactions = await fetchTransactions(searchParams, userId);

  const canUserAddTransactions = await canUserAddTransaction();

  return (
    <>
      <Navbar />
      <div className="p-6 space-y-6">
        <div className="flex w-full items-center">
          <h1 className="font-bold text-2xl">
            Transações de {MONTHS_OPTIONS_LABEL.get(searchParams.month) ?? ""}{" "}
            de {searchParams.year}
          </h1>
          <div className="flex ml-auto items-center space-y-4 space-x-0 flex-col md:flex-row md:space-x-4 md:space-y-0">
  <FilterTransaction />
  <AddTransactionButton userCanAddTransaction={canUserAddTransactions} />
</div>

        </div>    
        <DataTable
          columns={transactionsColumns}
          data={JSON.parse(JSON.stringify(transactions))}
        />
      </div>
    </>
  );
};

export default function TransactionsPage(props: TransactionsProps) {
  return (
    <Suspense fallback={<Loading />}>
      <Transactions {...props} />
    </Suspense>
  );
}
