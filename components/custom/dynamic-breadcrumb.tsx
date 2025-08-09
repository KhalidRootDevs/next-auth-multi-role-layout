'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from '@/components/ui/breadcrumb';

type BreadcrumbItemType = {
  label: string;
  href?: string;
};

type DynamicBreadcrumbsProps = {
  customBreadcrumbs?: BreadcrumbItemType[];
  showHome?: boolean;
};

export default function DynamicBreadcrumbs({
  customBreadcrumbs,
  showHome = false
}: DynamicBreadcrumbsProps) {
  const pathname = usePathname();

  const generateBreadcrumbs = (): BreadcrumbItemType[] => {
    const segments = pathname.split('/').filter(Boolean);

    const breadcrumbs = segments.map((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/');

      const label = decodeURIComponent(segment)
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());

      return { label, href };
    });

    const homeCrumb = { label: 'Home', href: '/' };

    return showHome ? [homeCrumb, ...breadcrumbs] : breadcrumbs;
  };

  const breadcrumbsToRender = customBreadcrumbs?.length
    ? customBreadcrumbs
    : generateBreadcrumbs();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbsToRender.map((crumb, index) => {
          const isLast = index === breadcrumbsToRender.length - 1;

          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {crumb.href && !isLast ? (
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
