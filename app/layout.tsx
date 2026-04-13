import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Providers } from '@/components/Providers';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: {
    default:  'Brevet Hub — Intellectual Property Marketplace',
    template: '%s | Brevet Hub',
  },
  description:
    'Buy, sell, and license patents & intellectual property on the world\'s most trusted IP marketplace. Discover innovations across technology, biotech, software, and more.',
  keywords: ['patents', 'intellectual property', 'IP marketplace', 'patent licensing', 'invention', 'brevet'],
  openGraph: {
    type:        'website',
    locale:      'en_US',
    url:         'https://brevethub.com',
    siteName:    'Brevet Hub',
    title:       'Brevet Hub — Intellectual Property Marketplace',
    description: 'The world\'s most trusted marketplace for buying and licensing patents.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'hsl(222,28%,11%)',
                color: 'hsl(213,20%,88%)',
                border: '1px solid hsl(222,20%,20%)',
              },
              success: { iconTheme: { primary: '#C9A84C', secondary: '#0B1120' } },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
