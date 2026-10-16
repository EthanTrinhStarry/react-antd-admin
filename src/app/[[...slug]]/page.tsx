import { redirect } from 'next/navigation';

import App from '@/App';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  if (!slug?.length) {
    redirect('/dashboard');
  }

  return <App initialPath={`/${slug.join('/')}`} />;
}
