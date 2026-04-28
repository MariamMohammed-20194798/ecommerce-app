import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './tailwind.config.ts';
import { QueryProvider } from '@/providers/query-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

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
      <body className={`${inter.className} min-h-dvh bg-muted flex flex-col`} suppressHydrationWarning>
        <QueryProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer/>
        </QueryProvider>
      </body>
    </html>
  );
}