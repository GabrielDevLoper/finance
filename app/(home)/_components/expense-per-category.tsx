import { CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { Progress } from "@/app/_components/ui/progress";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { TRANSACTION_CATEGORY_LABELS } from "@/app/_constants/transaction";
import { TotalDespesaPorCategoria } from "@/app/_data/get-dashboard/types";

interface ExpensePerCategoryProps {
  expensesPerCategory: TotalDespesaPorCategoria[];
}

const ExpensePerCategory = ({
  expensesPerCategory,
}: ExpensePerCategoryProps) => {
  return (
    <ScrollArea className="col-span-2 rounded-md border pb-6 h-full">
      <CardHeader>
        <CardTitle className="font-bold">Despesas por categoria</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {expensesPerCategory.map((categoria) => (
          <div key={categoria.categoria} className="space-y-2">
            <div className="flex justify-between w-full">
              <p className="text-sm font-bold">
                {TRANSACTION_CATEGORY_LABELS[categoria.categoria]}
              </p>
              <p className="text-sm font-bold">
                {categoria.porcentagemPorTotal}%
              </p>
            </div>
            <Progress value={categoria.porcentagemPorTotal} />
          </div>
        ))}
      </CardContent>
    </ScrollArea>
  );
};

export default ExpensePerCategory;
