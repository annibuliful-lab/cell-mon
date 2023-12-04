import { redisClient } from '@cell-mon/db';
import { logger } from '@cell-mon/utils';
import axios, { AxiosError } from 'axios';
import cookie from 'cookie';
import https from 'https';

import { HUNTER_CACHE_SESSION_KEY } from '../../constants';

// const Certpath = path.resolve(
//   process.cwd(),
//   'apps',
//   'backend-core',
//   'src',
//   'graphql',
//   'modules',
//   'hunter',
//   'UANDLINCA.cer',
// );
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export class HrlService {
  private instance = axios.create({
    method: 'get',
    baseURL: process.env.HUNTER_SERVER,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 20000,
    httpsAgent: httpsAgent,
  });

  async tracking({
    msisdn = '',
    missionId = '',
  }: {
    msisdn: string;
    missionId: string;
  }) {
    try {
      const JSESSIONID = await redisClient.get(HUNTER_CACHE_SESSION_KEY);
      const { data } = await this.instance.request({
        url: `/ULINClient/getOOBGeoLocation?MissionId=${missionId}&Msisdn=${msisdn}`,
        headers: {
          Cookie: `JSESSIONID=${JSESSIONID}`,
        },
      });

      return data;
    } catch (error) {
      logger.error(error, 'HLR-tracking-error');
      return null;
    }
  }

  async isLoggedin() {
    const JSESSIONID = await redisClient.get(HUNTER_CACHE_SESSION_KEY);

    try {
      await this.instance.request({
        url: `/ULINClient/isUserAuthorized`,
        headers: {
          Cookie: `JSESSIONID=${JSESSIONID}`,
        },
        timeout: 5800,
      });

      return { isLoggedin: true };
    } catch (error) {
      const err: AxiosError = error;
      if (['ECONNABORTED', 'EHOSTUNREACH'].includes(err.code)) {
        throw 'Request rejected. Please check your VPN connection.';
      }
      logger.error(error, `HLR-login err: ${err.code}`);
      return { isLoggedin: false };
    }
  }

  async loginSession() {
    try {
      logger.info({ serviceName: '[Hunter]-loginSession' });
      const response = await this.instance.request({
        method: 'post',
        url: '/ULINClient/authenticateUser',
        data: JSON.stringify({
          username: 'devthailand',
          pass: 'dev@hailan#21',
        }),
      });

      const setCookieHeader = response.headers['set-cookie'];

      if (setCookieHeader.length) {
        setCookieHeader.map((data) => {
          const result = cookie.parse(data);
          if (result['JSESSIONID']) {
            redisClient.set(HUNTER_CACHE_SESSION_KEY, result['JSESSIONID']);
          }
        });
        return { isLoggedin: true };
      }
      return { isLoggedin: false };
    } catch (error) {
      return { isLoggedin: false };
    }
  }

  async create({
    name,
    missionId,
    description,
  }: {
    name: string;
    missionId: string;
    description: string;
  }) {
    const JSESSIONID = await redisClient.get(HUNTER_CACHE_SESSION_KEY);
    await this.instance.request({
      method: 'post',
      url: `/ULINClient/mission`,
      headers: {
        Cookie: `JSESSIONID=${JSESSIONID}`,
      },
      data: JSON.stringify({
        Name: name,
        Mission_Id: missionId,
        Description: description,
      }),
    });
    return { missionCreated: true };
  }

  async search({
    missionId = [],
    targetId = [],
    numberId = [],
    fromDate,
    toDate,
    detailsSource = [2, 6, 0],
  }: {
    missionId: string[];
    targetId: string[];
    numberId: string[];
    detailsSource?: number[];
    fromDate: string;
    toDate: string;
  }) {
    const missionIds = `{ids:[${missionId}]}`;
    const targetIds = `{ids:[${targetId}]}`;
    const numberIds = `{ids:[${numberId}]}`;
    const detailsSourceIds = `{ids:[${detailsSource}]}`;
    const JSESSIONID = await redisClient.get(HUNTER_CACHE_SESSION_KEY);

    const { data } = await this.instance.request({
      url: `/ULINClient/mapLocationDetails?missionid=${missionIds}&targetid=${targetIds}&numberid=${numberIds}&FromDate=${fromDate}&ToDate=${toDate}&detailsSource=${detailsSourceIds}`,
      headers: {
        Cookie: `JSESSIONID=${JSESSIONID}`,
      },
    });
    return data;
  }

  webhookCallback(result) {
    return axios.request({
      method: 'post',
      url: process.env.CORE_CALLBACK_URI,
      data: result,
    });
  }
}
