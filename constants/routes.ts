import {
  BarChart3,
  CalendarMinus,
  ClipboardList,
  FolderKanban,
  Settings,
  Users
} from 'lucide-react';

export const PUBLIC_PATHS = [
  '/',
  '/home',
  '/about',
  '/contact',
  '/pricing',
  '/terms',
  '/privacy'
];

export const ROLE_PATH_MAP: Record<string, string> = {
  admin: '/admin',
  manager: '/manager',
  support: '/support',
  user: '/user'
};

export const AUTH_ROUTES = ['/panel-login', '/login'];

export const API_AUTH_PREFIX = '/api/auth';

export const NAV_ITEMS = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: BarChart3
  },
  {
    title: 'Employees',
    url: '/dashboard/employees',
    icon: Users
  },
  {
    title: 'Projects',
    url: '/dashboard/projects',
    icon: FolderKanban
  },
  {
    title: 'Task Entries',
    url: '/dashboard/tasks',
    icon: ClipboardList
  },
  {
    title: 'Leave Management',
    icon: CalendarMinus,
    isActive: false,
    items: [
      { title: 'Leave Entries', url: '/dashboard/leave/entries' },
      { title: 'Employee Leave', url: '/dashboard/leave/employee' }
    ]
  },

  {
    title: 'Settings',
    icon: Settings,
    isActive: false,
    items: [
      { title: 'General Settings', url: '/dashboard/settings' },
      { title: 'Settings History', url: '/dashboard/settings/history' }
    ]
  }
];
