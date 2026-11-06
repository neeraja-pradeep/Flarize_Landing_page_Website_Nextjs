import type { Auth } from '../../domain/entities/auth';

export function AuthCard({ item }: { item: Auth }) {
  return <div>{item.id}</div>;
}
