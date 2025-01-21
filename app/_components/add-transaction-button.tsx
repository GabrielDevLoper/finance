"use client";

import { useState } from "react";
import UpserTransactionDialog from "./upsert-transaction-dialog";
import { Button } from "./ui/button";
import { ArrowDownUpIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface AddTransactionButtonProps {
  userCanAddTransaction: boolean;
}

const AddTransactionButton = ({
  userCanAddTransaction,
}: AddTransactionButtonProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="rounded-full font-bold text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3"
              onClick={() => setDialogIsOpen(true)}
              disabled={!userCanAddTransaction}
            >
              <ArrowDownUpIcon className="ml-2" />
              Adicionar transações
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {!userCanAddTransaction &&
              "Você atingiu o limite de transação. Atualize seu plano para criar transações ilimitadas"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <UpserTransactionDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
      />
    </>
  );
};

export default AddTransactionButton;
