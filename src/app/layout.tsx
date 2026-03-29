import type { Metadata, Viewport } from 'next';
import { Kanit } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const kanit = Kanit({ 
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: '23 Art Home - คอร์สศิลปะสำหรับเด็ก',
  description: 'เลือกคอร์สศิลปะให้เหมาะกับน้องได้ง่ายๆ เลือกได้ทั้งแบบจัดคอร์สเอง หรือเลือกคอร์สสำเร็จรูป พร้อมอุปกรณ์ศิลปะครบชุด',
  keywords: 'คอร์สศิลปะ, ศิลปะเด็ก, เรียนวาดรูป, คอร์สเรียนศิลปะ, 23 Art Home',
  authors: [{ name: '23 Art Home' }],
  openGraph: {
    title: '23 Art Home - คอร์สศิลปะสำหรับเด็ก',
    description: 'เลือกคอร์สศิลปะให้เหมาะกับน้องได้ง่ายๆ',
    type: 'website',
    locale: 'th_TH',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#f0761f',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={cn(kanit.className, 'scroll-smooth')}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={cn(
        'min-h-screen bg-gradient-to-br from-white via-art-50/30 to-white antialiased',
        'text-gray-900 font-thai'
      )}>
        <div className="relative flex min-h-screen flex-col">
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}