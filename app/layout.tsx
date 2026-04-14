import './ui/global.css';
import { fontPrimary } from './ui/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontPrimary}>
      <body>{children}</body>
    </html>
  );
}
