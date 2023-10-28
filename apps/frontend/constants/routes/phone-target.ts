export const phoneTargetRoutes = {
  phoneTarget: {
    showOnSidebar: false,
    label: 'Phone target',
    path: (missionId: string, targetId: string, id: string) =>
      `/mission/${missionId}/target/${targetId}/phone-target/${id}`,
  },
} as const;
