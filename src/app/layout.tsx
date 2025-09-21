import type { Metadata } from 'next';
import './globals.css';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { SiteHeader } from '@/components/layout/header';
import { SiteSidebar } from '@/components/layout/sidebar';
import { Toaster } from "@/components/ui/toaster";
import { PageTransition } from '@/components/layout/page-transition';
import { cn } from '@/lib/utils';

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
      <body className={cn("font-sans antialiased")}>
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
