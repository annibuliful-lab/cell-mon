import { HrlService } from '../modules/hlr/hlr.service';
import { JobService } from '../modules/job/job.service';

export type GraphqlContext = { apiKey: string; workspaceId: string };

export type AppContext = GraphqlContext & {
  hlrService: HrlService;
  jobService: JobService;
};
