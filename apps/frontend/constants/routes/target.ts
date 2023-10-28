import { phoneTargetRoutes } from './phone-target';
import { targetEvidenceRoutes } from './target-evidence';

export const targetRoutes = {
  target: {
    showOnSidebar: false,
    label: 'Target',
    path: (missionId: string) => `/mission/${missionId}/target`,
    children: {
      ...targetEvidenceRoutes,
      ...phoneTargetRoutes,
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
    },
  },
} as const;
