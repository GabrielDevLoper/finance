import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "../_components/navbar";
import SummaryCards from "./_components/summary-cards";
import TimeSelect from "./_components/time-select";
import { format, isMatch } from "date-fns";
import { TransactionsPieChart } from "./_components/transactions-pie-charts";
import { getDashboard } from "../_data/get-dashboard";
import ExpensePerCategory from "./_components/expense-per-category";
import LastTransactions from "./_components/last-transactions";

interface HomeProps {
  searchParams: {
    month: string;
    year: string;
  };
}

export default async function Home({
  searchParams: { month, year },
}: HomeProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const monthIsInvalid = !month || !isMatch(month, "MM");
  const yearIsInvalid = !year || !isMatch(year, "yyyy");

  if (monthIsInvalid || yearIsInvalid) {
    const dataAtual = new Date();
    const mesAtual = format(dataAtual, "MM");
    const anoAtual = format(dataAtual, "yyyy");

    redirect(`?month=${mesAtual}&year=${anoAtual}`);
  }

  const dashboard = await getDashboard({ mes: month, ano: year });

  return (
    <>
      <Navbar />
      <div className="flex h-full flex-col space-y-6 overflow-hidden p-6">
        <div className="flex justify-between">
          <h1 className="font-bold text-2xl">Dashboard</h1>
          <div className="flex justify-between space-x-4">
            <TimeSelect />
          </div>
        </div>

        <div className="grid h-full grid-cols-[2fr,1fr] gap-6 overflow-hidden">
          <div className="flex flex-col gap-6 overflow-hidden">
            <SummaryCards {...dashboard} />
            <div className="grid h-full grid-cols-3 grid-rows-1 gap-6 overflow-hidden">
              <TransactionsPieChart {...dashboard} />
              <ExpensePerCategory
                expensesPerCategory={dashboard.totalDespesaPorCategoria}
              />
            </div>
          </div>
          <LastTransactions lastTransactions={dashboard.ultimasTransacoes} />
        </div>
      </div>
    </>
  );
}
