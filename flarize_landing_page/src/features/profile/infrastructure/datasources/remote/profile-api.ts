import { httpClient } from '@/core/network/http-client';

// Remote data source — talks to the API (axios).
export const profileApi = {
  list: () => httpClient.get('/profile'),
};
