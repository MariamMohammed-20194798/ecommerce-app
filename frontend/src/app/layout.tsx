import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { HomeNavbar } from '@/components/home-navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Custom T-Shirt Shop',
  description: 'Design your own custom apparel',
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
          <div className="min-h-dvh bg-background">
            <HomeNavbar />
            {children}
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}