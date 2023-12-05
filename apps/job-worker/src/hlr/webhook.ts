import { jobDbClient, primaryDbClient } from '@cell-mon/db';
import { createClient } from '@cell-mon/graphql-client';
import { getCellTechnology, logger, padString } from '@cell-mon/utils';
import { config } from 'dotenv';
import {
  createWorkerClient,
  HlrCoreWsPayload,
  HlrCoreWsPayloadData,
  JOB_KEYS,
} from 'job';
import { fetch } from 'undici';

config();
export const hlrWebhookWorker = createWorkerClient<HlrCoreWsPayload>({
  name: JOB_KEYS.HLR_GEO_WEBHOOK,
  processor: async (worker) => {
    const payload = worker.data;
    const hlrData = JSON.parse(payload.data) as HlrCoreWsPayloadData;
    const job = await jobDbClient
      .selectFrom('job')
      .select(['workspaceId', 'id', 'input'])
      .where('referenceId', '=', hlrData.dialogId)
      .executeTakeFirst();

    if (!job) {
      logger.warn(hlrData, '[Job-Worker]: job not found');
      await worker.remove();
      return;
    }

    if (!job.input) {
      logger.warn(hlrData, '[Job-Worker]: input is null');
      await worker.remove();
      return;
    }

    const jobInput = job.input as {
      missionId: string;
      msisdn: string;
      dialogId: string;
      phoneTargetLocationId: string;
    };

    const msisdn = jobInput.msisdn;
    const phoneTargetLocationId = jobInput.phoneTargetLocationId;

    if (!msisdn) {
      logger.warn(hlrData, '[Job-Worker]: msisdn is null');
      await worker.remove();
      return;
    }

    if (!phoneTargetLocationId) {
      logger.warn(hlrData, '[Job-Worker]: phoneTargetLocationId is null');
      await worker.remove();
      return;
    }

    try {
      const workspaceConfig = await primaryDbClient
        .selectFrom('workspace_configuration')
        .select(['apiKey'])
        .where('workspaceId', '=', job.workspaceId)
        .executeTakeFirst();

      if (!workspaceConfig) {
        await jobDbClient
          .updateTable('job')
          .set({
            result: hlrData,
            updatedAt: new Date(),
            completedAt: new Date(),
            status: 'COMPLETED',
          })
          .where('id', '=', job.id)
          .execute();
        await worker.remove();

        return;
      }

      const client = createClient({
        url: process.env.GRAPHQL_ENDPOINT,
        fetch,
        headers: {
          'x-api-key': workspaceConfig.apiKey,
        },
      });

      const phoneTarget = await primaryDbClient
        .selectFrom('phone_target')
        .innerJoin('target', 'phone_target.targetId', 'target.id')
        .innerJoin(
          'phone_metadata',
          'phone_metadata.id',
          'phone_target.phoneId',
        )
        .innerJoin(
          'phone_metadata_msisdn',
          'phone_metadata_msisdn.id',
          'phone_metadata.msisdnId',
        )
        .select(['phone_target.id as id'])
        .where('target.workspaceId', '=', job.workspaceId)
        .where('phone_metadata_msisdn.msisdn', '=', msisdn)
        .executeTakeFirst();

      if (!phoneTarget) {
        logger.warn(hlrData, '[Job-Worker]: phone target not found');
        await worker.remove();

        return;
      }

      const isSuccess = hlrData.returnCode.value.includes('Success');

      if (!isSuccess) {
        await client.mutation({
          updatePhoneTargetLocation: {
            __args: {
              id: phoneTargetLocationId,
              status: 'FAILED',
              hrlReferenceId: hlrData.dialogId,
            },
          },
        });
        await worker.remove();

        return;
      }

      await client.mutation({
        updatePhoneTargetLocation: {
          __scalar: true,
          __args: {
            status: 'COMPLETED',
            hrlReferenceId: hlrData.dialogId,
            id: phoneTargetLocationId,
            geoLocations: [
              {
                source: 'HLR_Query',
                latitude: hlrData.location.position.latitude.toString(),
                longtitude: hlrData.location.position.longitude.toString(),
              },
            ],
            network: {
              code: hlrData.location.country.countryCode.toString(),
              mcc: hlrData.location.country.mcc,
              mnc: padString(hlrData.location.country.mnc, 2),
              country: hlrData.location.country.countryName,
              operator: hlrData.location.country.operatorName,
            },
            cellInfo: {
              type: getCellTechnology({
                on4G: hlrData.location.network.on4G,
                mnc: padString(hlrData.location.country.mnc, 2),
              }),
              range: hlrData.location.radius.toString(),
              lac: hlrData.location.network.lac?.toString() ?? '',
              cid: hlrData.location.network.cellId?.toString() ?? '',
            },
          },
        },
      });

      await jobDbClient
        .updateTable('job')
        .set({
          result: hlrData,
          updatedAt: new Date(),
          completedAt: new Date(),
          status: 'COMPLETED',
        })
        .where('id', '=', job.id)
        .execute();
    } catch (error) {
      logger.error(error, '[Job-Worker]: internal server failed');

      await jobDbClient
        .updateTable('job')
        .set({
          result: hlrData,
          updatedAt: new Date(),
          completedAt: new Date(),
          status: 'FAILED',
        })
        .where('id', '=', job.id)
        .execute();
    }
  },
});
