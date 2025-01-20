import { auth, clerkClient } from "@clerk/nextjs/server";
import { getCurrentMonthTransactions } from "./get-current-month-transactions";

export const canUserAddTransaction = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("unauthorization");
  }

  const user = await clerkClient().users.getUser(userId);

  const hasPremiumPlan = user?.publicMetadata.subscriptionPlan === "premium";

  if (hasPremiumPlan) {
    return true;
  }

  const currrentMonthTransactions = await getCurrentMonthTransactions();

  if (currrentMonthTransactions >= 10) {
    return false;
  }

  return true;
};
