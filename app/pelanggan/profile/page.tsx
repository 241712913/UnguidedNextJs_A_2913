import type { Metadata } from "next";
import ProfilPelangganClient from "./ProfilPelangganClient";

export const metadata: Metadata = {
  title: "Profil Saya",
  description: "Lihat dan edit informasi profil Anda di SahabatKargo.",
};

export default function Page() {
  return <ProfilPelangganClient />;
}
