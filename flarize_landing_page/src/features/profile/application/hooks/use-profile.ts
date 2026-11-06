import { useQuery } from '@tanstack/react-query';
import { fetchProfile } from '../usecases/fetch-profile';

// The 'provider' equivalent: wires usecase + TanStack Query.
export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const result = await fetchProfile();
      return result.match(
        (data) => data,
        (failure) => { throw new Error(failure.message); },
      );
    },
  });
}
