import { IGraphqlContext } from '@cell-mon/graphql';

import { AccountService } from '../modules/account/account.service';
import { AuthenticationService } from '../modules/authentication/authentication.service';
import {
  FeatureFlagService,
  WorkspaceFeatureflagService,
} from '../modules/feature-flag/feature-flag.service';
import { Fileservice } from '../modules/file/file.service';
import { MessageGroupService } from '../modules/message/message-group.service';
import { MessageGroupMemberService } from '../modules/message/message-group-member.service';
import { PermissionAbilityService } from '../modules/permission-ability/permission-ability.service';
import { ProjectService } from '../modules/project/project.service';
import { WorkspaceService } from '../modules/workspace/workspace.service';

export interface IServiceContext {
  accountService: AccountService;
  permissionAbilityService: PermissionAbilityService;
  authenticationService: AuthenticationService;
  featureFlagService: FeatureFlagService;
  workspaceFeatureflagService: WorkspaceFeatureflagService;
  workspaceService: WorkspaceService;
  fileservice: Fileservice;
  projectService: ProjectService;
  messageGroupService: MessageGroupService;
  messageGroupMemberService: MessageGroupMemberService;
}

export type AppContext = IGraphqlContext & IServiceContext;
