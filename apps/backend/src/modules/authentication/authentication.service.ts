import { PrimaryRepository } from '@tadchud-erp/db';
import {
  AuthenticationError,
  IGraphqlContext,
  NotfoundResource,
} from '@tadchud-erp/graphql';
import { IJwtAuthInfo, jwtSign, jwtVerify } from '@tadchud-erp/utils';
import { verify } from 'argon2';
import { BinaryLike, createHash } from 'crypto';
import { v4 } from 'uuid';

import { Authentication, LoginInput } from '../../codegen-generated';
export class AuthenticationService extends PrimaryRepository<
  never,
  IGraphqlContext
> {
  private hashSha256(content: BinaryLike) {
    return createHash('sha256').update(content).digest('hex');
  }

  private async generateToken({
    workspaceIds,
    accountId,
  }: Pick<IJwtAuthInfo, 'accountId' | 'workspaceIds'>) {
    const payload = {
      workspaceIds,
      accountId,
      unique: v4(),
    };

    const token = jwtSign({
      payload,
      expiresIn: '30m',
    });

    const refreshToken = jwtSign({
      payload,
      expiresIn: '7d',
    });

    const hashToken = this.hashSha256(token);
    const hashRefreshToken = this.hashSha256(refreshToken);

    await this.db
      .insertInto('authentication_token')
      .values([
        { hash: hashToken },
        { parentHashId: hashToken, hash: hashRefreshToken },
      ])
      .execute();

    return {
      token,
      refreshToken,
      hashToken,
      hashRefreshToken,
    };
  }

  async refreshToken(token: string) {
    const { isValid, userInfo } = jwtVerify(token);

    if (!isValid || !userInfo) {
      throw new AuthenticationError('Unauthorization');
    }

    await this.db.transaction().execute(async (tx) => {
      const refreshToken = await tx
        .updateTable('authentication_token')
        .set({
          isRevoke: true,
          revokeDateTime: new Date(),
        })
        .where('hash', '=', this.hashSha256(token))
        .returning('parentHashId')
        .executeTakeFirst();

      if (refreshToken.parentHashId) {
        await tx
          .updateTable('authentication_token')
          .set({
            isRevoke: true,
            revokeDateTime: new Date(),
          })
          .where('hash', '=', refreshToken.parentHashId)
          .executeTakeFirst();
      }
    });

    return this.generateToken(userInfo);
  }

  async logout(token: string) {
    const hash = this.hashSha256(token);
    const { userInfo, isValid } = jwtVerify(token);

    if (!isValid || !userInfo) {
      throw new AuthenticationError();
    }

    await this.redis.del(userInfo.accountId);

    return this.db
      .updateTable('authentication_token')
      .set({
        isRevoke: true,
        revokeDateTime: new Date(),
      })
      .where('hash', '=', hash)
      .executeTakeFirst();
  }

  async login(
    input: LoginInput
  ): Promise<Authentication & { hashToken: string; hashRefreshToken: string }> {
    const user = await this.db
      .selectFrom('account')
      .select(['id', 'password', 'uid'])
      .where(({ or, cmpr }) =>
        or([
          cmpr('username', '=', input.username),
          cmpr('email', '=', input.username),
        ])
      )
      .where('deletedAt', '=', null)
      .executeTakeFirst();

    if (!user) {
      throw new NotfoundResource(['username or password']);
    }

    if (!(await verify(user.password, input.password))) {
      throw new NotfoundResource(['username or password']);
    }

    const workspaceIds = (
      await this.db
        .selectFrom('workspace')
        .select(['id'])
        .where('ownerId', '=', user.id)
        .execute()
    ).map((w) => w.id);

    return this.generateToken({ workspaceIds, accountId: user.uid });
  }
}
