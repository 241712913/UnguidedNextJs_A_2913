import type { Metadata } from "next";
import DetailAdminClient from "./DetailAdminClient";

export const metadata: Metadata = {
  title: "Detail Pengiriman",
  description: "Lihat detail data pengiriman di SahabatKargo.",
};

export default function Page() {
  return <DetailAdminClient />;
}
