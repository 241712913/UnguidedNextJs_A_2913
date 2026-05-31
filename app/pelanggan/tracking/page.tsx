import type { Metadata } from "next";
import TrackingClient from "./TrackingClient";

export const metadata: Metadata = {
  title: "Lacak Pengiriman",
  description: "Lacak status pengiriman Anda di SahabatKargo.",
};

export default function Page() {
  return <TrackingClient />;
}
