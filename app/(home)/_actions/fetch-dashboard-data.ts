import { getDashboard } from "@/app/_data/get-dashboard";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { format, isMatch } from "date-fns";
import { redirect } from "next/navigation";

export async function fetchDashboardData({
  month,
  year,
}: {
  month: string;
  year: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const monthIsInvalid = !month || !isMatch(month, "MM");
  const yearIsInvalid = !year || !isMatch(year, "yyyy");

  if (monthIsInvalid || yearIsInvalid) {
    const dataAtual = new Date();
    const mesAtual = format(dataAtual, "MM");
    const anoAtual = format(dataAtual, "yyyy");

    redirect(`?month=${mesAtual}&year=${anoAtual}`);
  }

  const dashboardData = await getDashboard({ mes: month, ano: year });
  const user = await clerkClient().users.getUser(userId);

  return { dashboardData, user };
}
