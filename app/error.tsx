'use client';

import ErrorPage from '@/components/error';

export default function Error() {
  return (
    <ErrorPage
      message="There is a error on this page"
      backPage="Home"
      backRoute="/"
    />
  );
}
