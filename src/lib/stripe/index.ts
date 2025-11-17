import Stripe from "stripe";
import { assertEnv } from "@/lib/utils";

let stripeClient: Stripe | null = null;

export function getStripe() {
  if (!stripeClient) {
    stripeClient = new Stripe(assertEnv("STRIPE_SECRET_KEY", process.env.STRIPE_SECRET_KEY), {
      apiVersion: "2025-10-29.clover",
      appInfo: {
        name: "Habitee",
      },
    });
  }

  return stripeClient;
}

export function getConnectClientId() {
  return assertEnv("STRIPE_CONNECT_CLIENT_ID", process.env.STRIPE_CONNECT_CLIENT_ID);
}

