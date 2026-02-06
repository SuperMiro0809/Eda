// ----------------------------------------------------------------------

export const fallbackLng = 'bg';
export const languages = ['bg', 'en'];
export const defaultNS = 'common';
export const allNamespaces = ['common', 'auth', 'navbar', 'forms', 'validation', 'messages'];
export const cookieName = 'i18next';

// ----------------------------------------------------------------------

export function i18nOptions(lng = fallbackLng, ns = allNamespaces) {
  return {
    // debug: true,
    lng,
    fallbackLng,
    ns,
    defaultNS,
    fallbackNS: defaultNS,
    supportedLngs: languages,
  };
}

// ----------------------------------------------------------------------

export const changeLangMessages = {
  en: {
    success: 'Language has been changed!',
    error: 'Error changing language!',
    loading: 'Loading...',
  }
};
