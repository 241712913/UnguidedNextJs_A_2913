import './ui/global.css';
import { fontPrimary } from './ui/fonts';
import type { Metadata } from 'next';

// ── Metadata default (dipakai semua halaman kecuali di-override) ─────────────
export const metadata: Metadata = {
  title: {
    default: 'SahabatKargo.id — Solusi Logistik UMKM Modern',
    template: '%s | SahabatKargo.id',
  },
  description:
    'Satu platform untuk kelola dan pantau semua pengiriman barang secara real-time.',
  keywords: ['logistik', 'pengiriman', 'kargo', 'UMKM', 'tracking', 'resi'],
  authors: [{ name: 'SahabatKargo.id' }],
  metadataBase: new URL('https://sahabatkargo.id'),
  openGraph: {
    title: 'SahabatKargo.id',
    description: 'Kirim Tanpa Ribet, Pantau Semua Dalam Satu Platform.',
    siteName: 'SahabatKargo.id',
    locale: 'id_ID',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={fontPrimary}>
      <body className="overflow-x-hidden">{children}</body>
    </html>
  );
}
