'use client';

import { useAuth } from '../../application/hooks/use-auth';
import { AuthCard } from '../components/auth-card';

export function AuthScreen() {
  const { data, isLoading, isError } = useAuth();

  if (isLoading) return <p>Loading…</p>;
  if (isError) return <p>Something went wrong.</p>;
  if (!data?.length) return <p>No items yet.</p>;

  return <div>{data.map((item) => <AuthCard key={item.id} item={item} />)}</div>;
}
