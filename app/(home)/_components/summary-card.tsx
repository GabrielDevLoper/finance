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
    <Card className={`${size === "large" ? "bg-white bg-opacity-5" : ""}`}>
      <CardHeader className="flex-row items-center gap-4">
        {icon}
        <p
          className={`${
            size === "small" ? "text-muted-foreground" : "text-white opacity-70"
          }`}
        >
          {title}
        </p>
      </CardHeader>
      <CardContent className="flex justify-between">
        <p
          className={`font-bold ${size === "small" ? "text-2xl" : "text-4xl"}`}
        >
          {Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(value)}
        </p>

        {size === "large" && (
          <AddTransactionButton
            userCanAddTransaction={canUserAddTransactions}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
