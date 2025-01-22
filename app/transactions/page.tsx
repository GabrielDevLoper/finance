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
        <div className="flex w-full justify-between items-center">
          <h1 className="font-bold text-2xl">
            Transações de {MONTHS_OPTIONS_LABEL.get(searchParams.month) ?? ""}{" "}
            de {searchParams.year}
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

      {/* <div className="p-6 space-y-6">
      <div className="flex w-full justify-between items-center">
        <Skeleton className="h-8 w-1/3 rounded" /> 
        <div className="flex space-x-4">
          <Skeleton className="h-10 w-32 rounded" /> 
          <Skeleton className="h-10 w-40 rounded" />
        </div>
      </div>

    
      <div className="space-y-4">
        <Skeleton className="h-10 w-full rounded" /> 
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-full rounded" /> 
          ))}
        </div>
      </div>
    </div> */}
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
