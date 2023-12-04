import { redisClient } from '@cell-mon/db';
import { logger } from '@cell-mon/utils';
import { HlrCoreWsPayload, hlrGeoWebhookQueue } from 'job';
import { isNil } from 'lodash';
import { WebSocket } from 'ws';

import { HUNTER_CACHE_SESSION_KEY } from '../../constants';
import { HrlService } from './hlr.service';

type ConnectionTimeoutType = {
  timeout: NodeJS.Timeout | null;
  status?: boolean | null;
};

function createTimeoutInSec(
  wsClient: WebSocket,
  connectTimeoutId: ConnectionTimeoutType,
  newTimInSec = 0,
) {
  const connectTimeoutInMiliSec = 1000 * newTimInSec;
  if (newTimInSec && !connectTimeoutId.timeout) {
    connectTimeoutId.timeout = setTimeout(() => {
      hlrWSAutoReconnect(wsClient, connectTimeoutId);
    }, connectTimeoutInMiliSec);
  }

  if (connectTimeoutId.timeout && !newTimInSec) {
    connectTimeoutId.timeout = setTimeout(() => {
      hlrWSAutoReconnect(wsClient, connectTimeoutId);
    }, connectTimeoutInMiliSec);
  }
}

function hlrWSAutoReconnect(
  wsClient: WebSocket,
  connectTimeoutId: ConnectionTimeoutType,
) {
  logger.info({ serviceName: 'Core System', WebSocketClient: 'Reconnect....' });
  if (connectTimeoutId.timeout) {
    wsClient.close();
    wsClient = null;
    clearTimeout(connectTimeoutId.timeout);
    delete connectTimeoutId.timeout;
    hlrWSConnect(wsClient);
    return;
  }

  logger.error({
    serviceName: 'Core system',
    message: 'Cannot connect to hunter',
  });
}

export async function hlrWSConnect(
  wsClient: WebSocket = null,
  connectTimeoutId: ConnectionTimeoutType = { timeout: null, status: null },
) {
  const JSESSIONID = await redisClient.get(HUNTER_CACHE_SESSION_KEY);

  if (!process.env.HLR_SERVER) {
    logger.info({
      serviceName: 'Core System',
      WebSocketClient: 'error',
      error: 'Not found process.env.HLR_SERVER',
    });
    return;
  }

  if (wsClient) return;

  wsClient = new WebSocket(
    `${process.env.HLR_SERVER.replace('http', 'ws')}/ULINClient/AgentWebsocket`,
    {
      headers: { Cookie: `JSESSIONID=${JSESSIONID}` },
      rejectUnauthorized: false,
    },
  );

  createTimeoutInSec(wsClient, connectTimeoutId, 10);

  wsClient.on('open', () => {
    clearTimeout(connectTimeoutId.timeout);
    delete connectTimeoutId.timeout;
    logger.info({
      serviceName: 'Core System',
      WebSocketClient: 'Connect success',
    });
  });

  wsClient.on('message', async (data) => {
    const payload = JSON.parse(data.toString()) as HlrCoreWsPayload;
    logger.info(payload, 'Hunter data');

    if (isNil(payload.data) || payload.type === 'ASYNC_OPERATION_PROGRESS') {
      return;
    }

    await hlrGeoWebhookQueue.add(
      'Hlr',
      {
        dialogId: '',
        imsi: '',
        range: '',
        cellInfo: undefined,
        geoLocations: [],
      },
      {
        removeOnComplete: true,
      },
    );
  });

  wsClient.on('close', (close) => {
    if (close === 1000) {
      logger.info({
        serviceName: 'Core System',
        WebSocketClient: 'close',
        error: `Disconnect by Server, pls check cookie ${close}`,
      });
      createTimeoutInSec(wsClient, connectTimeoutId, 6);
    } else if (close === 1006) {
      /** reconnect by timeout */
      logger.warn({
        serviceName: 'Core System',
        WebSocketClient: 'close',
        error: `Disconnect by Client ,[func()] wsClient.close() ${close}`,
      });
    } else {
      /** Can't reconnect */
      logger.error({
        serviceName: 'Core System',
        WebSocketClient: 'close',
        error: `Websocket Close by Other code: ${close}`,
      });
    }
  });

  wsClient.on('error', (error) => {
    logger.error({
      serviceName: 'Core System',
      WebSocketClient: 'error',
      error: error.toString(),
    });
  });
}

export async function healthCheckCookieTimeout(ms: number): Promise<void> {
  const hlr = new HrlService();
  await hlr.loginSession();
  setInterval(async () => {
    try {
      const IsLogin = await hlr.isLoggedin();
      if (IsLogin.isLoggedin) {
        return IsLogin.isLoggedin;
      }
      await hlr.loginSession();
    } catch (error) {
      console.log({ error });
    }
  }, ms);
}
