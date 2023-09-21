import { PrimaryRepository } from '@cell-mon/db';
import {
  AuthenticationError,
  GraphqlContext,
  NotfoundResource,
} from '@cell-mon/graphql';
import { IJwtAuthInfo, jwtSign, jwtVerify } from '@cell-mon/utils';
import { verify } from 'argon2';
import { BinaryLike, createHash } from 'crypto';
import { v4 } from 'uuid';

import { Authentication, LoginInput } from '../../codegen-generated';
export class AuthenticationService extends PrimaryRepository<
  never,
  GraphqlContext
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
      .insertInto('session_token')
      .values({ token: hashToken, accountId })
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

    await this.db
      .updateTable('session_token')
      .set({
        revoke: true,
      })
      .where('token', '=', this.hashSha256(token))
      .executeTakeFirst();

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
      .updateTable('session_token')
      .set({
        revoke: true,
      })
      .where('token', '=', hash)
      .executeTakeFirst();
  }

  async login(
    input: LoginInput
  ): Promise<Authentication & { hashToken: string; hashRefreshToken: string }> {
    const user = await this.db
      .selectFrom('account')
      .select(['id', 'password'])
      .where('username', '=', input.username)
      .executeTakeFirst();

    if (!user) {
      throw new NotfoundResource(['username or password']);
    }

    if (!(await verify(user.password, input.password))) {
      throw new NotfoundResource(['username or password']);
    }

    const workspaceIds = (
      await this.db.selectFrom('workspace').select(['id']).execute()
    ).map((w) => w.id);

    return this.generateToken({ workspaceIds, accountId: user.id });
  }
}
