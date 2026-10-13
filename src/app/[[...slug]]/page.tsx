'use client';

import dynamic from 'next/dynamic';

const ClientApp = dynamic(() => import('@/App'), {
  loading: () => <div className="next-loading" aria-label="Loading application" />,
  ssr: false,
});

export default function Page() {
  return <ClientApp />;
}
