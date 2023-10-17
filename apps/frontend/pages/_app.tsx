import '@mantine/core/styles.css';

import { ApolloProvider } from '@apollo/client';
import { MantineProvider } from '@mantine/core';
import { AppProps } from 'next/app';
import { Inter } from 'next/font/google';

import { client as apolloClient } from '../clients/apollo';
import { theme } from '../themes/core';

const inter = Inter({ subsets: ['latin'] });

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ApolloProvider client={apolloClient}>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <main className={inter.className}>
            <Component {...pageProps} />
          </main>
        </MantineProvider>
      </ApolloProvider>
    </>
  );
}

export default CustomApp;
