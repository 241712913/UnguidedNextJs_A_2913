import type { Metadata } from "next";
import DetailPelangganClient from "./DetailPelangganClient";

export const metadata: Metadata = {
  title: "Detail Riwayat",
  description: "Lihat detail pengiriman dari riwayat Anda.",
};

export default function Page() {
  return <DetailPelangganClient />;
}
