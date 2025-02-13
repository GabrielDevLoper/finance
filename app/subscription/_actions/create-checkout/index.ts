"use server";

import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

interface CreateStripeCheckoutProps {
  plan_price: string;
}

export const createStripeCheckout = async ({
  plan_price,
}: CreateStripeCheckoutProps) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key not found");
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-01-27.acacia",
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    success_url: process.env.APP_URL,
    cancel_url: process.env.APP_URL,
    subscription_data: {
      metadata: {
        clerk_user_id: userId,
      },
    },
    line_items: [
      {
        price: plan_price,
        quantity: 1,
      },
    ],
  });

  return { sessionId: session.id };
};
