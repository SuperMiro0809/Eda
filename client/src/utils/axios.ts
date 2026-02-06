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
}