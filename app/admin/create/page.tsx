import type { Metadata } from "next";
import CreateAdminClient from "./CreateAdminClient";

export const metadata: Metadata = {
  title: "Input Pengiriman",
  description: "Buat pengiriman baru untuk SahabatKargo.",
};

export default function Page() {
  return <CreateAdminClient />;
}