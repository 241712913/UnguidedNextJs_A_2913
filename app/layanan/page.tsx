import type { Metadata } from "next";
import LayananClient from "./LayananClient";

export const metadata: Metadata = {
  title: "Layanan SahabatKargo.id",
  description: "Temukan berbagai layanan pengiriman terbaik dari SahabatKargo untuk kebutuhan logistik Anda.",
};

export default function Page() {
  return <LayananClient />;
}
