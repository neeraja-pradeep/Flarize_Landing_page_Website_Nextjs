import type { Profile } from '../../domain/entities/profile';

export function ProfileCard({ item }: { item: Profile }) {
  return <div>{item.id}</div>;
}
