import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { parseCookies } from 'nookies';

const protectedRoutes = [
  '/minhas-oportunidades',
  '/meu-perfil',
  '/criar-oportunidade',
];

const isProtectedRoute = (url: string) => {
  return protectedRoutes.some((route) => url?.includes(route));
};

export const api: AxiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8001/api', // <<<<<< agora chama o proxy e não dá CORS
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

api.interceptors.request.use((config) => {
  const { accessToken } = parseCookies();

  if (!config.url) {
    console.warn('API request with undefined URL blocked');
    return Promise.reject(new Error('API request URL is undefined'));
  }

  console.log('Request URL:', config.url);

  const isFormData = config.data instanceof FormData;
  if (config.headers) {
    config.headers['Accept'] = 'application/json';
    config.headers['X-Requested-With'] = 'XMLHttpRequest';

    if (!isFormData) {
      config.headers['Content-Type'] = 'application/json';
    } else {
      delete config.headers['Content-Type'];
    }
  }

  if (accessToken && config.headers) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  } else if (isProtectedRoute(config.url)) {
    return Promise.reject({
      response: { status: 401, message: 'Unauthorized access' },
    });
  }

  return config;
});

const originalRequest = api.request;
api.request = function <T = any, R = AxiosResponse<T>, D = any>(
  config: AxiosRequestConfig<D>
): Promise<R> {
  if (config.url?.includes('auth/oauth')) {
    config.withCredentials = true;
    const isFormData = config.data instanceof FormData;

    if (config.headers) {
      config.headers['Accept'] = 'application/json';
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      if (!isFormData) {
        config.headers['Content-Type'] = 'application/json';
      } else {
        delete config.headers['Content-Type'];
      }
    }
  }

  return originalRequest.call(this, config) as Promise<R>;
};

api.interceptors.response.use(
  (response) => {
    if (response.config.url === 'settings') {
      response.data = Array.isArray(response.data) ? response.data : [];
    }
    return response;
  },
  (error) => {
    console.error('API Error:', error);

    if (error.message && error.message.includes('Network Error')) {
      console.error('Possible CORS issue detected. Check proxy or backend.');
    }

    if (error.response) {
      switch (error.response.status) {
        case 401:
        case 403:
          document.cookie =
            'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          document.cookie =
            'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          return Promise.reject('Sessão expirada. Faça login novamente.');

        case 500:
          alert('Ops! Tivemos problemas ao processar sua solicitação.');
          return Promise.reject('Erro interno do servidor');

        default:
          return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export const apiIbge = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_GOV,
});
