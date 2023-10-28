export const targetEvidenceRoutes = {
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
} as const;
