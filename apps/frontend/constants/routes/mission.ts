import { targetRoutes } from './target';

export const missionRoutes = {
  mission: {
    showOnSidebar: true,
    label: 'Mission',
    path: '/mission',
    children: {
      get: {
        showOnSidebar: false,
        label: 'Get mission',
        path: (id: string) => `/mission/${id}`,
      },
      create: {
        showOnSidebar: false,
        label: 'Create mission',
        path: '/mission/create',
      },
      update: {
        showOnSidebar: false,
        label: 'Update mission',
        path: (id: string) => `/mission/update/${id}`,
      },
      delete: {
        showOnSidebar: false,
        label: 'Delete mission',
        path: (id: string) => `/mission/delete/${id}`,
      },
      ...targetRoutes,
    },
  },
} as const;
