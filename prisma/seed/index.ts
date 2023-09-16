import { client } from './client';
import { seedMessageGroupMembers, seedMessageGroups } from './message-group';

import { seedPermissionAbilities } from './permission-ability';
import { seedPricingPlan } from './pricing-plan';
import {
  seedProjectAccounts,
  seedProjectRolePermission,
  seedProjectRoles,
  seedProjects,
} from './project';
import { seedUsers } from './user';
import { seedWorkspace } from './workspace';

async function cleanup() {
  const tablenamesList =
    (await client.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname='public'`) as {
      tablename: string;
    }[];

  const tablenames = tablenamesList
    .filter(({ tablename }) => tablename !== '_prisma_migrations')
    .map((t) => t.tablename);

  for (const tablename of tablenames) {
    await client.$executeRawUnsafe(
      `TRUNCATE TABLE "public"."${tablename}" CASCADE;`
    );
  }
}

async function main() {
  await cleanup();
  await seedPricingPlan();
  await seedUsers();
  await seedWorkspace();
  await seedProjects();
  await seedPermissionAbilities();
  await seedProjectRoles();
  await seedProjectAccounts();
  await seedProjectRolePermission();
  await seedMessageGroups();
  await seedMessageGroupMembers();
}

main();
