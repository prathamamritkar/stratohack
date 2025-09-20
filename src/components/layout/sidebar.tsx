'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  Network,
  AlertTriangle,
  GitBranch,
  Trophy,
  Info,
  Plane,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/', label: 'Network', icon: Network },
  { href: '/predict-delays', label: 'Predict Delays', icon: AlertTriangle },
  { href: '/simulate-reroutes', label: 'Simulate Reroutes', icon: GitBranch },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/about', label: 'About', icon: Info },
];

export function SiteSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 p-2">
            <Plane className="w-8 h-8 text-primary" />
            <div className="flex flex-col">
                <h2 className="text-lg font-semibold tracking-tight text-foreground group-data-[collapsible=icon]:hidden">AirNavFlow</h2>
                <p className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">Flow Prediction</p>
            </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = item.href === '/' ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <SidebarMenuItem key={item.label}>
                <Link href={item.href} passHref legacyBehavior>
                  <SidebarMenuButton
                    isActive={isActive}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
    </Sidebar>
  );
}
