import { db } from "../_lib/prisma";
import { DataTable } from "../_components/ui/data-table";
import { transactionsColumns } from "./_columns";
import AddTransactionButton from "../_components/add-transaction-button";
import Navbar from "../_components/navbar";

const Transactions = async () => {
  const transactions = await db.transacoes.findMany({});

  return (
    <>
      <Navbar />
      <div className="p-6 space-y-6">
        <div className="flex w-full justify-between items-center">
          <h1 className="font-bold text-2xl">Transações</h1>
          <AddTransactionButton />
        </div>

        <DataTable columns={transactionsColumns} data={transactions} />
      </div>
    </>
  );
};

export default Transactions;
