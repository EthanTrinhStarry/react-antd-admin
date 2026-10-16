import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

import 'driver.js/dist/driver.css';
import '@/styles/index.scss';

import { AntdRegistry } from '@ant-design/nextjs-registry';

export const metadata: Metadata = {
  title: 'React Antd Admin',
  description: 'An Ant Design admin dashboard powered by Next.js',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
