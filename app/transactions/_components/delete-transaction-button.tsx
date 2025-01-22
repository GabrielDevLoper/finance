"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/_components/ui/alert-dialog";
import { Button } from "@/app/_components/ui/button";
import { Loader2Icon, TrashIcon } from "lucide-react";
import { deleteTransaction } from "../_actions/delete-transaction";
import { toast } from "sonner";
import { useState } from "react";

interface DeleteTransactionButtonProps {
  transactionId: string;
}

const DeleteTransactionButton = ({
  transactionId,
}: DeleteTransactionButtonProps) => {
  const [deleteTransactionLoading, setDeleteTransactionIsLoading] =
    useState(false);

  const handleDeleteTransaction = async () => {
    try {
      setDeleteTransactionIsLoading(true);
      await deleteTransaction({ transactionId });
      toast.success("Transação deletada com sucesso.", {
        className: "bg-[#55B02E] dark:text-white border-none",
      });
      setDeleteTransactionIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Ocorreu um erro ao deletar a transação.");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size={"icon"}
          className="text-muted-foreground space-x-1"
        >
          <TrashIcon />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Voçê deseja realmente deletar esta transação?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteTransaction}
            disabled={deleteTransactionLoading}
          >
            {deleteTransactionLoading && (
              <Loader2Icon className="animate-spin" />
            )}
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTransactionButton;
