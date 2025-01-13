import { ArrowDownUpIcon } from "lucide-react";
import { Button } from "../_components/ui/button";
import { db } from "../_lib/prisma";
import { DataTable } from "../_components/ui/data-table";
import { transactionsColumns } from "./_columns";

const Transactions = async () => {
  const transactions = await db.transacoes.findMany({});

  return (
    <div className="p-6 space-y-6">
      <div className="flex w-full justify-between items-center">
        <h1 className="font-bold text-2xl">Transações</h1>
        <Button className="rounded-full">
          <ArrowDownUpIcon className="ml-2" />
          Adicionar transações
        </Button>
      </div>

      <DataTable columns={transactionsColumns} data={transactions} />
    </div>
  );
};

export default Transactions;
