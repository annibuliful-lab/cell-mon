import { GraphqlContext } from '@cell-mon/graphql';
import { PubSub } from 'mercurius';

import { AccountService } from '../modules/account/account.service';
import { AuthenticationService } from '../modules/authentication/authentication.service';
import { Fileservice } from '../modules/file/file.service';
import { MissionService } from '../modules/mission/mission.service';
import { MissionTargetService } from '../modules/mission-target/mission-target.service';
import { PermissionAbilityService } from '../modules/permission-ability/permission-ability.service';
import { PhoneMetadataService } from '../modules/phone-metadata/phone-metadata.service';
import { PhoneTargetService } from '../modules/phone-target/phone-target.service';
import { PhoneTargetLocationService } from '../modules/phone-target-location/phone-target-location.service';
import { TargetService } from '../modules/target/target.service';
import { TargetEvidenceService } from '../modules/target-evidence/target-evidence.service';
import { WorkspaceService } from '../modules/workspace/workspace.service';

export type ServiceContext = {
  accountService: AccountService;
  permissionAbilityService: PermissionAbilityService;
  authenticationService: AuthenticationService;
  workspaceService: WorkspaceService;
  fileservice: Fileservice;
  phoneMetadataService: PhoneMetadataService;
  missionService: MissionService;
  targetService: TargetService;
  missionTargetService: MissionTargetService;
  targetEvidenceService: TargetEvidenceService;
  phoneTargetService: PhoneTargetService;
  phoneTargetLocationService: PhoneTargetLocationService;
  pubsub: PubSub;
};

export type AppContext = GraphqlContext & ServiceContext;
