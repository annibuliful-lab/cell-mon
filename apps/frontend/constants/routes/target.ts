export const targetRoutes = {
  target: {
    showOnSidebar: true,
    label: 'Target',
    path: '/target',
    children: {
      get: {
        showOnSidebar: false,
        label: 'Get target',
        path: (id: string) => `/target/${id}`,
      },
      create: {
        showOnSidebar: false,
        label: 'Create target',
        path: '/target/create',
      },
      update: {
        showOnSidebar: false,
        label: 'Update target',
        path: (id: string) => `/target/update/${id}`,
      },
      delete: {
        showOnSidebar: false,
        label: 'Delete target',
        path: (id: string) => `/target/delete/${id}`,
      },
      evidence: {
        showOnSidebar: false,
        label: 'Get target evidence',
        path: '/target/evidence',
        children: {
          get: {
            showOnSidebar: false,
            label: 'Get evidence',
            path: (id: string) => `/target/evidence/${id}`,
          },
          create: {
            showOnSidebar: false,
            label: 'Create target evidence',
            path: '/target/evidence/create',
          },
          update: {
            showOnSidebar: false,
            label: 'Update target evidence',
            path: (id: string) => `/target/evidence/update/${id}`,
          },
          delete: {
            showOnSidebar: false,
            label: 'Delete target evidence',
            path: (id: string) => `/target/evidence/delete/${id}`,
          },
        },
      },
    },
  },
} as const;
