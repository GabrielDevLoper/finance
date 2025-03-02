"use client";

import { Button } from "@/app/_components/ui/button";
import { createStripeCheckout } from "../_actions/create-checkout";
import { loadStripe } from "@stripe/stripe-js";

interface AcquirePlanButtonProps {
  plan_price: string;
}

const AcquirePlanButton = ({ plan_price }: AcquirePlanButtonProps) => {
  const handleAcquirePlanClick = async () => {
    const { sessionId } = await createStripeCheckout({ plan_price });

    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      throw new Error("Stripe publishable key not found");
    }

    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    );

    if (!stripe) {
      throw new Error("Stripe not found");
    }

    await stripe.redirectToCheckout({ sessionId });
  };

  return (
    <Button
      onClick={handleAcquirePlanClick}
      className="rounded-full w-full font-bold"
    >
      Adquirir plano
    </Button>
  );
};

export default AcquirePlanButton;
