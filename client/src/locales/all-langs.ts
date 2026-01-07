'use client';

// date pickers (MUI)
import {
  enUS as enUSDate,
  bgBG as bgBGDate,
} from '@mui/x-date-pickers/locales';
// data grid (MUI)
import {
  enUS as enUSDataGrid,
  bgBG as bgBGDataGrid
} from '@mui/x-data-grid/locales';

// ----------------------------------------------------------------------

export const allLangs = [
  {
    value: 'en',
    label: 'English',
    countryCode: 'GB',
    adapterLocale: 'en',
    numberFormat: { code: 'en-US', currency: 'USD' },
    systemValue: {
      components: { ...enUSDate.components, ...enUSDataGrid.components },
    },
  },
  {
    value: 'bg',
    label: 'Български',
    countryCode: 'BG',
    adapterLocale: 'bg',
    numberFormat: { code: 'bg-BG', currency: 'EUR' },
    systemValue: {
      components: { ...bgBGDate.components, ...bgBGDataGrid.components },
    },
  },
];

/**
 * Country code:
 * https://flagcdn.com/en/codes.json
 *
 * Number format code:
 * https://gist.github.com/raushankrjha/d1c7e35cf87e69aa8b4208a8171a8416
 */
