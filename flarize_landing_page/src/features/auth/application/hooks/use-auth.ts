import { useQuery } from '@tanstack/react-query';
import { fetchAuth } from '../usecases/fetch-auth';

// The 'provider' equivalent: wires usecase + TanStack Query.
export function useAuth() {
  return useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const result = await fetchAuth();
      return result.match(
        (data) => data,
        (failure) => { throw new Error(failure.message); },
      );
    },
  });
}
