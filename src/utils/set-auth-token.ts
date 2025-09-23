import { api } from '@/app/api/api';

export function setAuthToken(token: string) {
  api.defaults.headers['Authorization'] = `Bearer ${token}`;
}