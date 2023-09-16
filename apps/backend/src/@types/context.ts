import { IGraphqlContext } from '@cell-mon/graphql';

import { AccountService } from '../modules/account/account.service';
import { AuthenticationService } from '../modules/authentication/authentication.service';
import { Fileservice } from '../modules/file/file.service';
import { PermissionAbilityService } from '../modules/permission-ability/permission-ability.service';
import { WorkspaceService } from '../modules/workspace/workspace.service';

export interface IServiceContext {
  accountService: AccountService;
  permissionAbilityService: PermissionAbilityService;
  authenticationService: AuthenticationService;
  workspaceService: WorkspaceService;
  fileservice: Fileservice;
}

export type AppContext = IGraphqlContext & IServiceContext;
