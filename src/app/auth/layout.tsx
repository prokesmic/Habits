import type { ReactNode } from "react";
import AuthLayoutGroup from "../(auth)/layout";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthLayoutGroup>{children}</AuthLayoutGroup>;
}
