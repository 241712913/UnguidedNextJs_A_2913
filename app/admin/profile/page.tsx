import type { Metadata } from "next";
import ProfilAdminClient from "./ProfilAdminClient";

export const metadata: Metadata = {
  title: "Profil Admin",
  description: "Kelola keamanan dan informasi akun admin SahabatKargo.",
};

export default function Page() {
  return <ProfilAdminClient />;
}
