import { Resend } from "resend";
import { assertEnv } from "@/lib/utils";

let client: Resend | null = null;

export function getResendClient() {
  if (!client) {
    client = new Resend(assertEnv("RESEND_API_KEY", process.env.RESEND_API_KEY));
  }

  return client;
}

