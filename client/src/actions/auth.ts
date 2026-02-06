'use server'

import {
  login,
  register,
  logout,
  getUser,
  LoginData,
  RegisterData
} from '@/api/auth';

export async function loginAction(data: LoginData) {
  return await login(data);
}

export async function registerAction(data: RegisterData) {
  return await register(data);
}

export async function logoutAction() {
  return await logout();
}

export async function getUserAction() {
  return await getUser();
}