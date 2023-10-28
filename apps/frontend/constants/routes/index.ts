import { authRoutes } from './auth';
import { missionRoutes } from './mission';
import { phoneRoutes } from './phone';
import { workspaceRoutes } from './workspace';

export const routes = {
  ...authRoutes,
  ...missionRoutes,
  ...workspaceRoutes,
  ...phoneRoutes,
};
