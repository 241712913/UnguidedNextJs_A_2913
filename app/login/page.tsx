import type { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Login Admin",
  description: "Masuk ke panel admin SahabatKargo.id",
};

export default function LoginPage() {
  return <LoginClient />;
}
