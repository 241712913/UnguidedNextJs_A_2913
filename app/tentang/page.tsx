import type { Metadata } from "next";
import TentangClient from "./tentangClient";

export const metadata: Metadata = {
  title: "Tentang SahabatKargo.id",
  description: "Pelajari lebih lanjut tentang SahabatKargo dan layanan pengiriman terbaik kami.",
};

export default function Page() {
  return <TentangClient />;
}
