import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { ApolloProvider } from '@apollo/client';
import { List, MantineProvider, Notification } from '@mantine/core';
import { Notifications, notifications } from '@mantine/notifications';
import { Provider as JotaiProvider, useAtom } from 'jotai';
import { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { useEffect } from 'react';

import { apolloClient } from '../clients/apollo';
import { errorAtom } from '../store/error';
import { theme } from '../themes/core';

const inter = Inter({ subsets: ['latin'] });

function AppWrapper({ Component, pageProps }: AppProps) {
  const [errors] = useAtom(errorAtom);

  useEffect(() => {
    if (errors.length === 0) return;

    notifications.show({
      autoClose: 5000,
      message: (
        <Notification withBorder color="red" title="Service error">
          <List>
            {errors.map((error) => (
              <List.Item key={error.message}>{error.message}</List.Item>
            ))}
          </List>
        </Notification>
      ),
    });
  }, [errors]);

  return (
    <main className={inter.className}>
      <Component {...pageProps} />
    </main>
  );
}

function CustomApp(props: AppProps) {
  return (
    <JotaiProvider>
      <ApolloProvider client={apolloClient}>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <Notifications />

          <AppWrapper {...props} />
        </MantineProvider>
      </ApolloProvider>
    </JotaiProvider>
  );
}

export default CustomApp;
