import type React from 'react';
import { Fragment } from 'react';

export default async function PublicLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Fragment>
      <main className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
        {children}
      </main>
    </Fragment>
  );
}
