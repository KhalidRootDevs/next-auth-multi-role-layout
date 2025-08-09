import { MainSidebar } from '@/components/layout/private/admin-sidebar';
import { DashboardHeader } from '@/components/layout/private/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type React from 'react';

export default async function MangerLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset className="flex h-screen flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-6 pt-6 md:p-8">
          <div className="w-full max-w-full">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
