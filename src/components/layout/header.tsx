'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';

const pageTitles: { [key: string]: string } = {
  '/': 'Global Airport Network',
  '/predict-delays': 'Cascading Delay Prediction',
  '/simulate-reroutes': 'Rerouting Strategy Simulation',
}

function getPageTitle(pathname: string): string {
  return pageTitles[pathname] || '';
}

export function SiteHeader() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>
    </header>
  );
}
