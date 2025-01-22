"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";

type DeleteTransactionType = {
  transactionId: string;
};

export const deleteTransaction = async ({
  transactionId,
}: DeleteTransactionType) => {
  try {
    await db.transacoes.delete({
      where: {
        id: transactionId,
      },
    });

    revalidatePath("/transactions");
    revalidatePath("/");
  } catch (error) {
    console.log(error);
  }
};
