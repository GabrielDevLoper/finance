import Navbar from "../_components/navbar";
import SummaryCards from "./_components/summary-cards";
import TimeSelect from "./_components/time-select";
import { TransactionsPieChart } from "./_components/transactions-pie-charts";
import ExpensePerCategory from "./_components/expense-per-category";
import LastTransactions from "./_components/last-transactions";
import AiReportButton from "../_components/ai-report-button";
import { SwitchTheme } from "../_components/swith-theme";
import { fetchDashboardData } from "./_actions/fetch-dashboard-data";
import { Suspense } from "react";
import Loading from "../_components/loading";

interface HomeProps {
  searchParams: {
    month: string;
    year: string;
  };
}

export default async function Home({
  searchParams: { month, year },
}: HomeProps) {
  const { dashboardData, user } = await fetchDashboardData({ month, year });

  return (
    <>
      <Navbar />
      <Suspense fallback={<Loading />}>
        <div className="flex h-full flex-col space-y-6 overflow-hidden p-6">
          <div className="flex justify-between">
            <h1 className="font-bold text-2xl">Dashboard</h1>
            <div className="flex  items-center gap-3">
              <SwitchTheme />
              <AiReportButton
                month={month}
                year={year}
                hasPremiumPlan={
                  user.publicMetadata.subscriptionPlan == "premium"
                }
              />
              <TimeSelect />
            </div>
          </div>

          <div className="grid h-full grid-cols-[2fr,1fr] gap-6 overflow-hidden">
            <div className="flex flex-col gap-6 overflow-hidden">
              <SummaryCards {...dashboardData} />

              <div className="grid h-full grid-cols-3 grid-rows-1 gap-6 overflow-hidden">
                <TransactionsPieChart {...dashboardData} />
                <ExpensePerCategory
                  expensesPerCategory={dashboardData.totalDespesaPorCategoria}
                />
              </div>
            </div>
            <LastTransactions
              lastTransactions={dashboardData.ultimasTransacoes}
            />
          </div>
        </div>
      </Suspense>
    </>
  );
}
