import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

dotenv.config();

const secret = process.env.JWT_SECRET as string;
const issuer = process.env.JWT_ISSER as string;

export interface IJwtAuthInfo extends jwt.JwtPayload {
  /**
   *  alias as account uid (UUID)
   */
  accountId: string;
  workspaceIds: number[];
}

export const sign = ({
  payload,
  expiresIn = '2d',
}: {
  payload: IJwtAuthInfo;
  expiresIn?: string | number;
}): string => {
  return jwt.sign(payload, secret, { expiresIn, issuer });
};

export const verify = <T = IJwtAuthInfo>(
  token: string
): { isValid: boolean; userInfo?: T } => {
  try {
    if (!token) {
      return { isValid: false };
    }

    const userInfo = jwt.verify(token, secret, { issuer }) as T;

    return { isValid: true, userInfo };
  } catch (err) {
    return { isValid: false };
  }
};
