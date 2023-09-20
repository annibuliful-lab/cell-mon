import type { ColumnType } from 'kysely';
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export const PermissionAction = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  READ: 'READ',
} as const;
export type PermissionAction =
  typeof PermissionAction[keyof typeof PermissionAction];
export const CellularTechnology = {
  NR: 'NR',
  LTE: 'LTE',
  GSM: 'GSM',
  WCDMA: 'WCDMA',
} as const;
export type CellularTechnology =
  typeof CellularTechnology[keyof typeof CellularTechnology];
export const MissionStatus = {
  DRAFT: 'DRAFT',
  PLANNING: 'PLANNING',
  INVESTIGATING: 'INVESTIGATING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const;
export type MissionStatus = typeof MissionStatus[keyof typeof MissionStatus];
export type Account = {
  id: string;
  username: string;
  password: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp | null;
};
export type AccountConfiguration = {
  accountId: string;
  isActive: Generated<boolean>;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp | null;
};
export type Mission = {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  status: Generated<MissionStatus>;
  createdBy: string;
  updatedBy: string | null;
  deletedAt: Timestamp;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp | null;
};
export type MissionTarget = {
  missionId: string;
  targetId: string;
  createdBy: string;
  updatedBy: string | null;
  deletedAt: Timestamp;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp | null;
};
export type Permission = {
  id: string;
  subject: string;
  action: PermissionAction;
};
export type PhoneCellInfo = {
  phoneLocationId: string;
  type: CellularTechnology;
  cid: string | null;
  lcid: string | null;
  lac: string | null;
  ci: string | null;
  eci: string | null;
  tac: string | null;
  enb: string | null;
  nci: string | null;
};
export type PhoneGeoLocation = {
  id: string;
  phoneLocationId: string;
  latitude: string;
  longtitude: string;
  source: string;
};
export type PhoneMetadata = {
  id: string;
  msisdn: string;
  imsi: string | null;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp | null;
  createdBy: string;
  updatedBy: string | null;
};
export type PhoneNetwork = {
  phoneLocationId: string;
  subscriptionStatus: string;
  roaming: boolean;
  code: string;
  name: string;
  operator: string;
  mnc: string;
  mcc: string;
};
export type PhoneTarget = {
  id: string;
  phoneId: string;
  targetId: string;
  createdBy: string;
  updatedBy: string | null;
  deletedAt: Timestamp;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp | null;
};
export type PhoneTargetLocation = {
  id: string;
  phoneTargetId: string;
  metadata: unknown | null;
  createdBy: string;
  sourceDateTime: Timestamp;
  createdAt: Generated<Timestamp>;
};
export type SessionToken = {
  token: string;
  revoke: Generated<boolean>;
  accountId: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp | null;
};
export type Target = {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  photoUrl: string | null;
  address: string | null;
  metadata: unknown | null;
  createdBy: string;
  updatedBy: string | null;
  deletedAt: Timestamp;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp | null;
};
export type TargetEvidence = {
  id: string;
  targetId: string;
  evidence: unknown | null;
  note: string;
  investigatedDate: Timestamp;
  createdBy: string;
  updatedBy: string | null;
  deletedAt: Timestamp;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp | null;
};
export type Workspace = {
  id: string;
  title: string;
  description: string | null;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp | null;
  createdBy: string;
  updatedBy: string | null;
};
export type WorkspaceAccount = {
  id: string;
  workspaceId: string;
  accountId: string;
  roleId: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp | null;
  createdBy: string;
  updatedBy: string | null;
};
export type WorkspaceConfiguration = {
  workspaceId: string;
  isActive: Generated<boolean>;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp | null;
  createdBy: string;
  updatedBy: string | null;
};
export type WorkspaceRole = {
  id: string;
  workspaceId: string;
  title: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp | null;
  createdBy: string;
  updatedBy: string | null;
};
export type WorkspaceRolePermission = {
  id: string;
  workspaceId: string;
  roleId: string;
  permissionId: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp | null;
  createdBy: string;
  updatedBy: string | null;
};
export type DB = {
  account: Account;
  account_configuration: AccountConfiguration;
  mission: Mission;
  mission_target: MissionTarget;
  permission: Permission;
  phone_cell_info: PhoneCellInfo;
  phone_geo_location: PhoneGeoLocation;
  phone_location: PhoneTargetLocation;
  phone_metadata: PhoneMetadata;
  phone_network: PhoneNetwork;
  phone_target: PhoneTarget;
  session_token: SessionToken;
  target: Target;
  target_evidence: TargetEvidence;
  workspace: Workspace;
  workspace_account: WorkspaceAccount;
  workspace_configuration: WorkspaceConfiguration;
  workspace_role: WorkspaceRole;
  workspace_role_permission: WorkspaceRolePermission;
};
