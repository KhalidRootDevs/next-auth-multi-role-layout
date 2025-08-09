'use client';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@/components/ui/sidebar';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from '@/components/ui/sidebar';
import {
  BarChart3,
  CalendarMinus,
  ChevronRight,
  ClipboardList,
  FolderKanban,
  Landmark,
  User
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { NavUser } from '../nav-user';

const navItems = [
  { title: 'Dashboard', url: '/employee/dashboard', icon: BarChart3 },
  { title: 'My Projects', url: '/employee/my-projects', icon: FolderKanban },
  { title: 'My Tasks', url: '/employee/my-tasks', icon: ClipboardList },
  {
    title: 'Leave Management',
    icon: CalendarMinus,
    isActive: false,
    items: [
      { title: 'My Leave', url: '/employee/my-leave' },
      { title: 'Leave Cycle', url: '/employee/my-leave-cycle' }
    ]
  },
  {
    title: 'Company',
    icon: Landmark,
    isActive: false,
    items: [
      { title: 'Terms & Condition', url: '/employee/company/terms' },
      { title: 'Policy', url: '/employee/company/policy' },
      { title: 'Agreement', url: '/employee/company/agreement' }
    ]
  }
];

export function EmployeeSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const { data: session } = useSession();
  const userRole = session?.user?.role;
  const user = session?.user;

  const itemsWithActive = navItems.map((item) => {
    if (item.items) {
      const isAnyChildActive = item.items.some((sub) => sub.url === pathname);
      return { ...item, isActive: isAnyChildActive };
    }
    return { ...item, isActive: item.url === pathname };
  });

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-6 items-center justify-center rounded-lg">
            <User className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold capitalize">
              {userRole}
            </span>
            <span className="truncate text-xs">{user?.email}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {itemsWithActive.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  {item.url ? (
                    <Link href={item.url}>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          className={
                            item.isActive ? 'bg-gray-200 text-foreground' : ''
                          }
                        >
                          {item.icon && <item.icon className="h-4 w-4" />}
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                    </Link>
                  ) : (
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className={
                          item.isActive ? 'bg-gray-200 text-foreground' : ''
                        }
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span>{item.title}</span>
                        {item.items && (
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                  )}

                  {item.items ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => {
                          const isSubActive = pathname === subItem.url;
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                className={
                                  isSubActive
                                    ? 'bg-gray-200 text-foreground'
                                    : ''
                                }
                              >
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>{user && <NavUser />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
