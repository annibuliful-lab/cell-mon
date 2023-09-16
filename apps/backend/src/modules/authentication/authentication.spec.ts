import { prismaDbClient } from '@cell-mon/db';
import { MOCK_GRAPHQL_CONTEXT } from '@cell-mon/graphql';
import { expectNotFoundError } from '@cell-mon/test';

import { AuthenticationService } from './authentication.service';

describe('Authentication', () => {
  const service = new AuthenticationService(MOCK_GRAPHQL_CONTEXT);

  describe('Refresh token', () => {
    it('refresh new token after login', async () => {
      const { refreshToken, hashRefreshToken, hashToken, token } =
        await service.login({
          username: 'MOCK_USER_A',
          password: '12345678',
        });

      const listTokenBeforeRefresh =
        await prismaDbClient.authenticationToken.findMany({
          where: {
            hash: {
              in: [hashToken, hashRefreshToken],
            },
          },
        });

      const { refreshToken: newRefreshToken, token: newToken } =
        await service.refreshToken(refreshToken);

      const listTokenAfterRefresh =
        await prismaDbClient.authenticationToken.findMany({
          where: {
            hash: {
              in: [hashToken, hashRefreshToken],
            },
          },
        });

      expect(newRefreshToken).not.toEqual(refreshToken);
      expect(newToken).not.toEqual(token);
      expect(listTokenBeforeRefresh.every((t) => !t.isRevoke)).toBeTruthy();
      expect(listTokenAfterRefresh.every((t) => t.isRevoke)).toBeTruthy();
    });
  });

  describe('Login', () => {
    it('login completely', async () => {
      const authToken = await service.login({
        username: 'MOCK_USER_A',
        password: '12345678',
      });

      expect(authToken.hashToken).toBeDefined();
      expect(authToken.hashRefreshToken).toBeDefined();
      expect(authToken.refreshToken).toBeDefined();
      expect(authToken.token).toBeDefined();
    });

    it('throws not found error when wrong username', async () => {
      expectNotFoundError(
        service.login({
          username: 'WRONG_ID',
          password: '12345asdasd678',
        })
      );
    });

    it('throws not found error when wrong password but correct username', async () => {
      expectNotFoundError(
        service.login({
          username: 'MOCK_USER_A',
          password: '12345aaw678',
        })
      );
    });
  });

  describe('Logout', () => {
    it('logout and revoke token', async () => {
      const { token, refreshToken, hashRefreshToken, hashToken } =
        await service.login({
          username: 'MOCK_USER_A',
          password: '12345678',
        });

      const listTokens = await prismaDbClient.authenticationToken.findMany({
        where: {
          hash: {
            in: [hashToken, hashRefreshToken],
          },
        },
      });

      expect(listTokens).toHaveLength(2);
      expect(listTokens.every((token) => !token.isRevoke)).toBeTruthy();

      await service.logout(token);
      await service.logout(refreshToken);

      const listRevokedTokens =
        await prismaDbClient.authenticationToken.findMany({
          where: {
            hash: {
              in: [hashToken, hashRefreshToken],
            },
          },
        });

      expect(listRevokedTokens.every((token) => token.isRevoke)).toBeTruthy();
    });
  });
});
