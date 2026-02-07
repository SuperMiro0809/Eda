'use server'

import {
  updateProfile,
  changePassword,
  uploadAvatar,
  deleteAvatar,
  UpdateProfileData,
  ChangePasswordData,
} from '@/api/user';

export async function updateProfileAction(data: UpdateProfileData) {
  return await updateProfile(data);
}

export async function changePasswordAction(data: ChangePasswordData) {
  return await changePassword(data);
}

export async function uploadAvatarAction(formData: FormData) {
  const file = formData.get('avatar') as File;
  if (!file) {
    return { error: 'No file provided' };
  }
  return await uploadAvatar(file);
}

export async function deleteAvatarAction() {
  return await deleteAvatar();
}
