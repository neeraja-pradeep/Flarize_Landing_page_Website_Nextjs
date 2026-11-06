import axios from 'axios';

// Configured axios instance (the equivalent of Flutter's Dio client).
export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 15000,
});
