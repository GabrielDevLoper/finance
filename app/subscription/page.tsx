import { auth, clerkClient } from "@clerk/nextjs/server";
import Navbar from "../_components/navbar";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader } from "../_components/ui/card";
import { CheckIcon, XIcon } from "lucide-react";
import AcquirePlanButton from "./_components/acquire_plan_button";
import { Badge } from "../_components/ui/badge";
import { getCurrentMonthTransactions } from "../_data/get-current-month-transactions";
import { Button } from "../_components/ui/button";
import Link from "next/link";

const Subscription = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/login");
  }

  const user = await clerkClient().users.getUser(userId);

  const hasPremiumPlan = user?.publicMetadata.subscriptionPlan === "premium";
  const hasPlanPlus = user?.publicMetadata.subscriptionPlan === "plus";

  const currentMonthTransactions = await getCurrentMonthTransactions();

  return (
    <>
      <Navbar />
      <div className="p-6 space-y-6">
        <h1 className="font-bold text-2xl">Assinatura</h1>
        <div className="flex flex-col md:flex-row gap-6">
          {" "}
          {/* Responsividade aqui */}
          {/* Card do Plano Básico */}
          <Card className="w-full md:w-[450px]">
            {" "}
            {/* Largura responsiva */}
            <CardHeader className="border-b border-solid py-8">
              <h2 className="text-center text-2xl font-semibold">
                Plano básico
              </h2>
              <div className="flex items-center gap-3 justify-center">
                <span className="text-4xl">R$</span>
                <span className="font-semibold text-6xl">0</span>
                <div className="text-2xl text-muted-foreground">/mês</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 py-8">
              <div className="flex items-center gap-2">
                <CheckIcon className="text-primary" />
                <p>
                  Apenas 10 transações por mês ({currentMonthTransactions}/10)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <XIcon />
                <p>Relatórios de IA</p>
              </div>
            </CardContent>
          </Card>
          {/* Card do Plano Plus */}
          <Card className="w-full md:w-[450px]">
            {" "}
            {/* Largura responsiva */}
            <CardHeader className="border-b border-solid py-8 relative">
              {hasPlanPlus && (
                <Badge className="absolute left-4 top-12 bg-primary/10 text-primary">
                  Ativo
                </Badge>
              )}

              <h2 className="text-center text-2xl font-semibold">Plano Plus</h2>
              <div className="flex items-center gap-3 justify-center">
                <span className="text-4xl">R$</span>
                <span className="font-semibold text-6xl">8,99</span>
                <div className="text-2xl text-muted-foreground">/mês</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 py-8">
              <div className="flex items-center gap-2">
                <CheckIcon className="text-primary" />
                <p>Transações ilimitadas</p>
              </div>

              <div className="flex items-center gap-2">
                <CheckIcon className="text-primary" />
                <p>Relatórios Excel (CSV das despesas e receitas do mês)</p>
              </div>

              {hasPlanPlus ? (
                <>
                  <Button
                    className="rounded-full w-full font-bold"
                    variant="link"
                  >
                    <Link
                      href={`${
                        process.env
                          .NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL as string
                      }?prefilled_email=${
                        user?.emailAddresses[0].emailAddress
                      }`}
                    >
                      Gerenciar plano
                    </Link>
                  </Button>
                </>
              ) : (
                <AcquirePlanButton
                  plan_price={process.env.STRIPE_PLUS_PLAN_PRICE_ID as string}
                />
              )}
            </CardContent>
          </Card>
          {/* Card do Plano Premium */}
          <Card className="w-full md:w-[450px]">
            {" "}
            {/* Largura responsiva */}
            <CardHeader className="border-b border-solid py-8 relative">
              {hasPremiumPlan && (
                <Badge className="absolute left-4 top-12 bg-primary/10 text-primary">
                  Ativo
                </Badge>
              )}

              <h2 className="text-center text-2xl font-semibold">
                Plano Premium
              </h2>
              <div className="flex items-center gap-3 justify-center">
                <span className="text-4xl">R$</span>
                <span className="font-semibold text-6xl">19</span>
                <div className="text-2xl text-muted-foreground">/mês</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 py-8">
              <div className="flex items-center gap-2">
                <CheckIcon className="text-primary" />
                <p>Transações ilimitadas</p>
              </div>

              <div className="flex items-center gap-2">
                <CheckIcon className="text-primary" />
                <p>Relatórios de IA</p>
              </div>

              <div className="flex items-center gap-2">
                <CheckIcon className="text-primary" />
                <p>Relatórios Excel (CSV das despesas e receitas do mês)</p>
              </div>

              {hasPremiumPlan ? (
                <>
                  <Button
                    className="rounded-full w-full font-bold"
                    variant="link"
                  >
                    <Link
                      href={`${
                        process.env
                          .NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL as string
                      }?prefilled_email=${
                        user?.emailAddresses[0].emailAddress
                      }`}
                    >
                      Gerenciar plano
                    </Link>
                  </Button>
                </>
              ) : (
                <AcquirePlanButton
                  plan_price={
                    process.env.STRIPE_PREMIUM_PLAN_PRICE_ID as string
                  }
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Subscription;
