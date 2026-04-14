import './ui/global.css';
import { fontPrimary } from './ui/fonts';

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