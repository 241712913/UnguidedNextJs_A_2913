import type { Metadata } from "next";
import RiwayatClient from "./RiwayatClient";

export const metadata: Metadata = {
  title: "Riwayat Pengiriman",
  description: "Lihat riwayat semua pengiriman Anda di SahabatKargo.",
};

export default function Page() {
  return <RiwayatClient />;
}
