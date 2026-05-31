import type { Metadata } from "next";
import DashboardAdminClient from "./DashboardAdminClient";

export const metadata: Metadata = {
  title: "Dashboard Admin",
  description: "Dashboard untuk admin SahabatKargo",
};

export default function Page() {
  return <DashboardAdminClient />;
}