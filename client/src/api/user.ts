import axios, { endpoints } from '@/utils/axios';
import { extractErrorMessage } from '@/utils/api-error';

import type { User } from './auth';

// ----------------------------------------------------------------------

export type UpdateProfileData = {
  firstName: string;
  familyName: string;
  email: string;
};

export type ChangePasswordData = {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
};

export type UserResponse = {
  status?: number;
  data?: {
    user: User;
  };
  error?: string;
};

export type MessageResponse = {
  status?: number;
  data?: {
    message: string;
  };
  error?: string;
};

// ----------------------------------------------------------------------

export async function updateProfile(data: UpdateProfileData): Promise<UserResponse> {
  try {
    const res = await axios.put(endpoints.user.profile, data);

    return { status: res.status, data: res.data };
  } catch (error) {
    return { error: extractErrorMessage(error) };
  }
}

export async function changePassword(data: ChangePasswordData): Promise<MessageResponse> {
  try {
    const res = await axios.put(endpoints.user.password, data);

    return { status: res.status, data: res.data };
  } catch (error) {
    return { error: extractErrorMessage(error) };
  }
}

export async function uploadAvatar(file: File): Promise<UserResponse> {
  try {
    const formData = new FormData();
    formData.append('avatar', file);

    const res = await axios.post(endpoints.user.avatar, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return { status: res.status, data: res.data };
  } catch (error) {
    return { error: extractErrorMessage(error) };
  }
}

export async function deleteAvatar(): Promise<MessageResponse> {
  try {
    const res = await axios.delete(endpoints.user.avatar);

    return { status: res.status, data: res.data };
  } catch (error) {
    return { error: extractErrorMessage(error) };
  }
}
