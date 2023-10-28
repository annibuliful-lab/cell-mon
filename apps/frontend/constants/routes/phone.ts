export const phoneRoutes = {
  phoneMetadata: {
    showOnSidebar: false,
    label: 'Phone',
    path: '/phone',
    children: {
      get: {
        showOnSidebar: false,
        label: 'Get Phone',
        path: (id: string) => `/phone/${id}`,
      },
      create: {
        showOnSidebar: false,
        label: 'Create phone',
        path: '/phone/create',
      },
      update: {
        showOnSidebar: false,
        label: 'Update phone',
        path: (id: string) => `/phone/update/${id}`,
      },
      delete: {
        showOnSidebar: false,
        label: 'Delete phone',
        path: (id: string) => `/phone/delete/${id}`,
      },
    },
  },
} as const;
