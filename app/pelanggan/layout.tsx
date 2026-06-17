"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PelangganLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const raw = sessionStorage.getItem("user");
        const u = raw ? JSON.parse(raw) : null;
        if (!u || u.role !== "pelanggan") {
          router.replace("/not-found");
          return;
        }
        setIsChecking(false);
      } catch {
        router.replace("/not-found");
      }
    };

    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [router]);

  if (isChecking) {
    return null;
  }

  return <>{children}</>;
}