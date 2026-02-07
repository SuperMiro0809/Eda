import axios, { endpoints } from '@/utils/axios';
import { extractErrorMessage } from '@/utils/api-error';
import { setAuthToken, removeAuthToken } from '@/auth/actions/auth-cookies';

// ----------------------------------------------------------------------

export type RegisterData = {
  firstName: string;
  familyName: string;
  email: string;
  password: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  first_name: string;
  family_name: string;
  full_name: string;
  email: string;
  avatar?: string;
};

export type AuthResponse = {
  status?: number;
  data?: {
    user: User;
    token: string;
  };
  error?: string;
};

export async function register(data: RegisterData): Promise<AuthResponse> {
  try {
    const res = await axios.post(endpoints.auth.register, data);

    const { token } = res.data;
    await setAuthToken(token);

    return { status: res.status, data: res.data };
  } catch (error) {
    return { error: extractErrorMessage(error) };
  }
}

export async function login(data: LoginData): Promise<AuthResponse> {
  try {
    const res = await axios.post(endpoints.auth.login, data);

    const { token } = res.data;
    await setAuthToken(token);

    return { status: res.status, data: res.data };
  } catch (error) {
    return { error: extractErrorMessage(error) };
  }
}

export async function logout() {
  try {
    const res = await axios.post(endpoints.auth.logout);
    await removeAuthToken();

    return { status: res.status, data: res.data };
  } catch (error) {
    await removeAuthToken();
    return { error: extractErrorMessage(error) };
  }
}

export async function getUser(): Promise<AuthResponse> {
  try {
    const res = await axios.get(endpoints.auth.me);

    return { status: res.status, data: res.data };
  } catch (error) {
    return { error: extractErrorMessage(error) };
  }
}
