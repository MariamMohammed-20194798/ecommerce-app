import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './tailwind.config.ts';
import { QueryProvider } from '@/providers/query-provider';
import { HomeNavbar } from '@/components/home-navbar';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Women\'s the brand: Luxury & confidence for everyday life.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <div className="min-h-dvh bg-primary">
            <HomeNavbar />
            {children}
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}