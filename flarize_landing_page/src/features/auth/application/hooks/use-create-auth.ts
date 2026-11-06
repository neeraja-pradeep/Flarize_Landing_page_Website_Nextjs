import { useMutation, useQueryClient } from '@tanstack/react-query';

// Mutation hook stub.
export function useCreateAuth() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_input: unknown) => { /* TODO: call usecase */ },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['auth'] }),
  });
}
