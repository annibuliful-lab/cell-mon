import { authRoutes } from './auth';
import { missionRoutes } from './mission';

export const routes = { ...authRoutes, ...missionRoutes };
