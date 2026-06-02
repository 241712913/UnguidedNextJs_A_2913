"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PelangganLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("user");
      const u = raw ? JSON.parse(raw) : null;
      if (!u || u.role !== "pelanggan") {
        router.replace("/not-found");
      }
    } catch {
      router.replace("/not-found");
    }
  }, [router]);

  return <>{children}</>;
}
