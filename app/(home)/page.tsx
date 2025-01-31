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
        <div className="flex h-full flex-col space-y-6 p-6">
          {/* Cabeçalho */}
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <h1 className="font-bold text-2xl">Dashboard</h1>
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

          {/* Conteúdo Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
            {/* Coluna da Esquerda (Cards de Resumo e Gráficos) */}
            <div className="flex flex-col gap-6">
              {/* Cards de Resumo */}
              <SummaryCards {...dashboardData} />

              {/* Gráficos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gráfico de Pizza */}
                <div className="md:col-span-1 ">
                  <TransactionsPieChart {...dashboardData} />
                </div>

                {/* Gráfico de Despesas por Categoria */}
                <div className="md:col-span-1 max-h-[472px]">
                  {" "}
                  {/* Altura máxima */}
                  <ExpensePerCategory
                    expensesPerCategory={dashboardData.totalDespesaPorCategoria}
                  />
                </div>
              </div>
            </div>

            {/* Coluna da Direita (Últimas Transações com Scroll) */}

            <LastTransactions
              lastTransactions={dashboardData.ultimasTransacoes}
            />
          </div>
        </div>
      </Suspense>
    </>
  );
}
