import { authRoutes } from './auth';
import { missionRoutes } from './mission';
import { phoneRoutes } from './phone';
import { targetRoutes } from './target';
import { workspaceRoutes } from './workspace';

export const routes = {
  ...authRoutes,
  ...missionRoutes,
  ...workspaceRoutes,
  ...phoneRoutes,
  ...targetRoutes,
};
