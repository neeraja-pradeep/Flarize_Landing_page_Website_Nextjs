import { httpClient } from '@/core/network/http-client';

// Remote data source — talks to the API (axios).
export const authApi = {
  list: () => httpClient.get('/auth'),
};
