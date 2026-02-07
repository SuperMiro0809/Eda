
// ----------------------------------------------------------------------

export const paths = {
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  chat: {
    root: `/chat`,
    details: (id: number | string) => `/chat/${id}`,
  },
  user: {
    profile: '/user/profile'
  },
  // AUTH
  auth: {
    login: '/login',
    register: '/register',
    forgotPassword: '/forgot-password',
  },
};
