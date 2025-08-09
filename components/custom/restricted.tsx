'use client';

import { useSession } from 'next-auth/react';
import { type ReactNode } from 'react';

interface RestrictedProps {
  allowedRoles: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function Restricted({
  allowedRoles,
  children,
  fallback = null
}: RestrictedProps) {
  const { data: session, status } = useSession();

  if (status === 'loading') return null;

  const userRole = session?.user?.role;

  const isAuthorized = userRole && allowedRoles.includes(userRole);

  if (!isAuthorized) {
    return fallback;
  }

  return <>{children}</>;
}
