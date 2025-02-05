import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = async (request: Request) => {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.error();
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.error();
  }

  const text = await request.text();

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-01-27.acacia",
  });

  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  switch (event.type) {
    case "invoice.paid": {
      // atualiza usuario com novo plano
      const { customer, subscription, subscription_details, lines } =
        event.data.object;

      // Pega o primeiro item da assinatura (caso tenha mais de um)
      const priceId = lines.data[0]?.price?.id;

      if (!priceId) {
        return NextResponse.error();
      }

      const clerkUserId = subscription_details?.metadata?.clerk_user_id;

      if (!clerkUserId) {
        return NextResponse.error();
      }

      // Determina qual plano foi assinado
      let planType = "free"; // Fallback para um plano gratuito

      if (priceId === process.env.STRIPE_PREMIUM_PLAN_PRICE_ID) {
        planType = "premium";
      } else if (priceId === process.env.STRIPE_PLUS_PLAN_PRICE_ID) {
        planType = "plus";
      }

      await clerkClient().users.updateUser(clerkUserId, {
        privateMetadata: {
          stripeCustomerId: customer,
          stripeSubscriptionId: subscription,
        },
        publicMetadata: {
          subscriptionPlan: planType,
        },
      });
      break;
    }
    case "customer.subscription.deleted": {
      // remover plano premium do usuario
      const subscription = await stripe.subscriptions.retrieve(
        event.data.object.id
      );

      const clerkUserId = subscription.metadata.clerk_user_id;

      if (!clerkUserId) {
        return NextResponse.error();
      }

      await clerkClient().users.updateUser(clerkUserId, {
        privateMetadata: {
          stripeCustomerId: null,
          stripeSubscriptionId: null,
        },
        publicMetadata: {
          subscriptionPlan: null,
        },
      });
    }
  }

  return NextResponse.json({ received: true });
};
