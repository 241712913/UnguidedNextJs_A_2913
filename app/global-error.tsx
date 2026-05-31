"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error ke monitoring service di sini (misal: Sentry)
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html lang="id">
      <body>
        <main className="min-h-screen bg-gradient-to-br from-red-50 to-white flex flex-col items-center justify-center p-6 text-center font-sans">

          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
            <AlertTriangle size={40} className="text-red-500" />
          </div>

          <div className="space-y-2 max-w-md">
            <h1 className="text-2xl font-bold text-slate-800">
              Terjadi Kesalahan
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Maaf, terjadi kesalahan yang tidak terduga pada sistem.
              Silakan coba muat ulang halaman ini.
            </p>
            {error?.message && (
              <p className="text-xs text-red-400 font-mono bg-red-50 border border-red-100 rounded-lg px-3 py-2 mt-3 break-all">
                {error.message}
              </p>
            )}
          </div>

          <button
            onClick={reset}
            className="mt-8 flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 transition"
          >
            <RefreshCw size={16} />
            Muat Ulang Halaman
          </button>

          <p className="mt-10 text-xs text-slate-400">© 2026 SahabatKargo.id</p>
        </main>
      </body>
    </html>
  );
}
