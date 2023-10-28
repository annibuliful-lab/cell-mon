import { Icon } from '@iconify/react';
import { AppShell, Burger, Group, NavLink, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ReactNode } from 'react';

import { routes } from '../constants/routes';
import { missionRoutes } from '../constants/routes/mission';
import { useMobile } from '../hooks/useMobile';

type DashboardLayoutProps = {
  children: ReactNode;
};

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [opened, { toggle }] = useDisclosure();
  const { isMobile } = useMobile();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Icon icon="carbon:cell-tower" width="48" />
          <Title order={isMobile ? 5 : 3}>Cellular Network Surveillance</Title>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        {Object.entries(routes).map(([key, value]) => {
          if (!value.showOnSidebar) return null;

          return (
            <NavLink
              key={key}
              label={value.label}
              leftSection={
                (value as typeof missionRoutes.mission).icon && (
                  <Icon
                    icon={(value as typeof missionRoutes.mission).icon}
                    width="24"
                    height="24"
                  />
                )
              }
            />
          );
        })}
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};
