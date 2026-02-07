import { Metadata } from 'next';
import { ProfileView } from '@/sections/user/views';

export const metadata: Metadata = {
  title: 'Eda | Profile'
};

export default function ProfilePage() {
  return <ProfileView />
}