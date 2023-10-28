export const targetRoutes = {
  target: {
    showOnSidebar: false,
    label: 'Target',
    path: (missionId: string) => `/mission/${missionId}/target`,
    children: {
      get: {
        showOnSidebar: false,
        label: 'Get target',
        path: (missionId: string, id: string) =>
          `/mission/${missionId}/target/${id}`,
      },
      create: {
        showOnSidebar: false,
        label: 'Create target',
        path: (missionId: string) => `/mission/${missionId}/target/create`,
      },
      update: {
        showOnSidebar: false,
        label: 'Update target',
        path: (missionId: string, id: string) =>
          `/mission/${missionId}/target/${id}/update`,
      },
      delete: {
        showOnSidebar: false,
        label: 'Delete target',
        path: (missionId: string, id: string) =>
          `/mission/${missionId}/target/${id}/delete`,
      },
      evidence: {
        showOnSidebar: false,
        label: 'Get target evidence',
        path: (targetId: string) => `/target/${targetId}/evidence`,
        children: {
          get: {
            showOnSidebar: false,
            label: 'Get evidence',
            path: (targetId: string, id: string) =>
              `/target/${targetId}/evidence/${id}`,
          },
          create: {
            showOnSidebar: false,
            label: 'Create target evidence',
            path: '/target/evidence/create',
          },
          update: {
            showOnSidebar: false,
            label: 'Update target evidence',
            path: (targetId: string, id: string) =>
              `/target/${targetId}/evidence/update/${id}`,
          },
          delete: {
            showOnSidebar: false,
            label: 'Delete target evidence',
            path: (targetId: string, id: string) =>
              `/target/${targetId}/evidence/delete/${id}`,
          },
        },
      },
    },
  },
} as const;
