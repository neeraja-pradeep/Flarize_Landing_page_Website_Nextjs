import type { ReactNode } from 'react';
import { QueryProvider } from '@/core/config/query-provider';

export default function Layout({ children }: { children: ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}
