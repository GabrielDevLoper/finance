import AddTransactionButton from "@/app/_components/add-transaction-button";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { canUserAddTransaction } from "@/app/_data/can-user-add-transaction";

import { ReactNode } from "react";

interface SummaryCardProps {
  title: string;
  icon: ReactNode;
  value: number;
  size?: "small" | "large";
}

const SummaryCard = async ({
  icon,
  title,
  value,
  size = "small",
}: SummaryCardProps) => {
  const canUserAddTransactions = await canUserAddTransaction();

  return (
    <Card
      className={`${
        size === "large"
          ? "dark:bg-white dark:bg-opacity-5 bg-black bg-opacity-5"
          : "bg-black bg-opacity-5"
      }`}
    >
      <CardHeader className="flex-row items-center gap-4">
        {icon}
        <p
          className={`${
            size === "small" ? "text-muted-foreground" : "opacity-70"
          }`}
        >
          {title}
        </p>
      </CardHeader>

      <CardContent className="flex justify-between">
        <p
          className={`font-bold ${
            size === "small"
              ? "lg:text-2xl sm:text-xl"
              : "lg:text-4xl sm:text-2xl"
          }`}
        >
          {Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(value)}
        </p>

        {size === "large" && (
          <div className="sm:mt-4 lg:mt-0">
            <AddTransactionButton
              userCanAddTransaction={canUserAddTransactions}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
