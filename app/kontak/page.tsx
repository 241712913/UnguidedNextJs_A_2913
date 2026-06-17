import type { Metadata } from "next";
import KontakClient from "./kontakClient";

export const metadata: Metadata = {
  title: "Kontak SahabatKargo.id",
  description: "Hubungi kami untuk informasi lebih lanjut tentang layanan pengiriman terbaik kami.",
};

export default function Page() {
  return <KontakClient />;
}
