import type { Metadata } from "next";
import HubungiClient from "./HubungiClient";

export const metadata: Metadata = {
  title: "Hubungi Kami",
  description: "Butuh bantuan? Hubungi tim SahabatKargo.",
};

export default function Page() {
  return <HubungiClient />;
}
