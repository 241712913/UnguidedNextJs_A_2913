"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const raw = sessionStorage.getItem("user");
        const u = raw ? JSON.parse(raw) : null;
        if (!u || u.role !== "admin") {
          router.replace("/login");
          return;
        }
        setIsChecking(false);
      } catch {
        router.replace("/login");
      }
    };

    // Delay check slightly to ensure sessionStorage is set by client
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [router]);

  if (isChecking) {
    return null; // or a loading component
  }

  return <>{children}</>;
}
