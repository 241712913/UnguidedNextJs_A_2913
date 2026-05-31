import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Beranda Pelanggan",
  description: "Pantau semua pengiriman Anda di SahabatKargo.",
};

export default function Page() {
  return <HomeClient />;
}
