"use client";

import { useState } from "react";

import { PencilIcon } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import UpserTransactionDialog from "@/app/_components/upsert-transaction-dialog";
import { Transacoes } from "@prisma/client";

interface EditTransactionButtonProps {
  transaction: Transacoes;
}

const EditTransactionButton = ({ transaction }: EditTransactionButtonProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size={"icon"}
        className="text-muted-foreground space-x-1"
        onClick={() => setDialogIsOpen(true)}
      >
        <PencilIcon />
      </Button>
      <UpserTransactionDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
        defaultValues={{
          ...transaction,
          valor: Number(transaction.valor),
          status: transaction.status ?? undefined, // Substitui null por undefined
          ano: transaction.ano ?? undefined, // Substitui null por undefined
          mes: transaction.mes ?? undefined, // Substitui null por undefined
        }}
        transactionId={transaction.id}
      />
    </>
  );
};

export default EditTransactionButton;
