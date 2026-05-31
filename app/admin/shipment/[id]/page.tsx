import type { Metadata } from "next";
import DetailPengirimanAdminClient from "./DetailPengirimanAdminClient";

export const metadata: Metadata = {
  title: "Detail Pengiriman",
  description: "Lihat detail data pengiriman di SahabatKargo.",
};

export default function Page() {
  return <DetailPengirimanAdminClient />;
}
