import type { Metadata } from 'next';
import './globals.css';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SiteHeader } from '@/components/layout/header';
import { SiteSidebar } from '@/components/layout/sidebar';
import { Toaster } from "@/components/ui/toaster";
import { PageTransition } from '@/components/layout/page-transition';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';

const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const fontHeadline = Inter({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-headline',
});

export const metadata: Metadata = {
  title: 'AirNavFlow',
  description: 'Airport Traffic Flow Prediction using Graph ML',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn("font-body antialiased", fontInter.variable, fontHeadline.variable)}>
        <SidebarProvider>
          <SiteSidebar />
          <SidebarInset>
            <SiteHeader />
             <PageTransition>
              {children}
            </PageTransition>
          </SidebarInset>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  );
}
