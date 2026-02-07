import axios from 'axios';

import { CONFIG } from '@/global-config';

import { getAuthToken } from '@/auth/actions/auth-cookies';

// ----------------------------------------------------------------------

const isServer = () => typeof window === 'undefined';

const axiosInstance = axios.create({ baseURL: CONFIG.serverUrl });

axiosInstance.interceptors.request.use(async (config) => {
  let accessToken = null;

  if (isServer()) {
    accessToken = await getAuthToken();
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
},
  (error) => {
    console.log(error)
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

// ----------------------------------------------------------------------

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: '/auth/me',
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout'
  },
  user: {
    profile: '/user/profile',
    password: '/user/password',
    avatar: '/user/avatar',
    delete: '/user',
  },
  chat: {
    sessions: {
      list: '/chat/sessions',
      create: '/chat/sessions',
      show: (id: string) => `/chat/sessions/${id}`,
      update: (id: string) => `/chat/sessions/${id}`,
      delete: (id: string) => `/chat/sessions/${id}`,
    },
    messages: {
      list: (sessionId: string) => `/chat/sessions/${sessionId}/messages`,
      create: (sessionId: string) => `/chat/sessions/${sessionId}/messages`,
      update: (sessionId: string, messageId: string) => `/chat/sessions/${sessionId}/messages/${messageId}`,
    },
  }
}