import type { Metadata } from "next";
import ShipmentClient from "./ShipmentClient";

export const metadata: Metadata = {
  title: "Daftar Pengiriman",
  description: "Kelola semua data pengiriman barang di SahabatKargo.",
};

export default function Page() {
  return <ShipmentClient />;
}
