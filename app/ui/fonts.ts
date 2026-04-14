import { Poppins } from 'next/font/google';

export const poppinsFont = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-primary',
});

export const fontPrimary = poppinsFont.className;
