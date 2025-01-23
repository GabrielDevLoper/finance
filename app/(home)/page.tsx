import Navbar from "../_components/navbar";
import SummaryCards from "./_components/summary-cards";
import TimeSelect from "./_components/time-select";
import { TransactionsPieChart } from "./_components/transactions-pie-charts";
import ExpensePerCategory from "./_components/expense-per-category";
import LastTransactions from "./_components/last-transactions";
import AiReportButton from "../_components/ai-report-button";
import { fetchDashboardData } from "./_actions/fetch-dashboard-data";
import { Suspense } from "react";
import Loading from "../_components/loading";
import { ScrollArea } from "../_components/ui/scroll-area";

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
            <h1 className="font-bold text-2xl hidden md:block">Dashboard</h1>
            <div className="flex flex-row items-center gap-3">
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

          <div className="grid h-full grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6 overflow-hidden">
            <ScrollArea>
              <div className="flex flex-col gap-6 overflow-hidden">
                <SummaryCards {...dashboardData} />

                {/* Adaptação responsiva para os gráficos */}
                <div className="grid h-full gap-6 overflow-hidden sm:grid-cols-1 md:grid-cols-1 md:grid-rows-2 lg:grid-cols-3 lg:grid-rows-1 min-h-[200px]">
                  <div className="md:row-span-1 lg:col-span-1">
                    <TransactionsPieChart {...dashboardData} />
                  </div>
                  <div className="md:row-span-1 lg:col-span-2">
                    <ExpensePerCategory
                      expensesPerCategory={
                        dashboardData.totalDespesaPorCategoria
                      }
                    />
                  </div>
                </div>
              </div>
            </ScrollArea>

            <LastTransactions
              lastTransactions={dashboardData.ultimasTransacoes}
            />
          </div>
        </div>
      </Suspense>
    </>
  );
}
