'use client';

import { useProfile } from '../../application/hooks/use-profile';
import { ProfileCard } from '../components/profile-card';

export function ProfileScreen() {
  const { data, isLoading, isError } = useProfile();

  if (isLoading) return <p>Loading…</p>;
  if (isError) return <p>Something went wrong.</p>;
  if (!data?.length) return <p>No items yet.</p>;

  return <div>{data.map((item) => <ProfileCard key={item.id} item={item} />)}</div>;
}
