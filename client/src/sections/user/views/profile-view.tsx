'use client';

import { useState } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { MainContent } from '@/layouts/main';

import { Iconify } from '@/components/iconify';

import ProfileGeneralTab from '../profile-general-tab';
import ProfileSecurityTab from '../profile-security-tab';

// ----------------------------------------------------------------------

export default function ProfileView() {
  const [currentTab, setCurrentTab] = useState('general');

  const NAV_ITEMS = [
    {
      label: 'General',
      icon: <Iconify width={24} icon="solar:user-id-bold" />,
      value: 'general',
    },
    {
      label: 'Security',
      icon: <Iconify width={24} icon="ic:round-vpn-key" />,
      value: 'security',
    },
  ];

  const handleTabChange = (_: any, newValue: string) => {
    setCurrentTab(newValue);
  }

  return (
    <MainContent>
      <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: { xs: 3, md: 5 } }}>
        {NAV_ITEMS.map((tab) => (
          <Tab
            key={tab.value}
            label={tab.label}
            icon={tab.icon}
            value={tab.value}
          />
        ))}
      </Tabs>

      {currentTab === 'general' && <ProfileGeneralTab />}

       {currentTab === 'security' && <ProfileSecurityTab />}
    </MainContent>
  );
}
