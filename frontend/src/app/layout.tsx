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
      <body className={inter.className}>
        <QueryProvider>
          <div className="min-h-dvh bg-muted">
            <Header />
            {children}
            <Footer/>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}