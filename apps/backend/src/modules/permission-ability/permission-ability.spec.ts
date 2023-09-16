import { MOCK_GRAPHQL_CONTEXT } from '@cell-mon/graphql';
import { expectNotFoundError } from '@cell-mon/test';
import { nanoid } from 'nanoid';
import { v4 } from 'uuid';

import { PermissionAction } from '../../codegen-generated';
import { PermissionAbilityService } from '../permission-ability/permission-ability.service';

describe('Permission ability', () => {
  const service = new PermissionAbilityService(MOCK_GRAPHQL_CONTEXT);
  describe('Create', () => {
    it('creates new record', async () => {
      const action = PermissionAction.Create;
      const subject = nanoid();
      const permissionAbility = await service.create({
        action,
        subject,
      });
      expect(permissionAbility.action).toEqual(action);
      expect(permissionAbility.subject).toEqual(subject);
    });
  });

  describe('Update', () => {
    it('updates an existing', async () => {
      const action = PermissionAction.Create;
      const subject = nanoid();
      const permissionAbility = await service.create({
        action,
        subject,
      });

      const updated = await service.update(permissionAbility.id, {
        action: PermissionAction.Read,
        subject: `updated-${permissionAbility.subject}`,
      });

      expect(updated.id).toEqual(permissionAbility.id);
      expect(updated.action).toEqual(PermissionAction.Read);
      expect(updated.subject).toEqual(`updated-${permissionAbility.subject}`);
    });

    it('throws not found error when update wrong id', () => {
      expectNotFoundError(
        service.update(v4(), {
          action: PermissionAction.Read,
          subject: `updated-`,
        })
      );
    });
  });

  describe('Delete', () => {
    it('deletes an existing', async () => {
      const action = PermissionAction.Create;
      const subject = nanoid();
      const permissionAbility = await service.create({
        action,
        subject,
      });

      const deleted = await service.delete(permissionAbility.id);
      expect(deleted.id).toEqual(permissionAbility.id);
    });

    it('throws not found by wrong id ', () => {
      expectNotFoundError(service.delete(v4()));
    });
  });

  describe('Get', () => {
    it('gets by id', async () => {
      const action = PermissionAction.Create;
      const subject = nanoid();
      const permissionAbility = await service.create({
        action,
        subject,
      });

      const result = await service.findById(permissionAbility.id);
      expect(permissionAbility).toEqual(result);
    });

    it('throws not found error when get by wrong id', () => {
      expectNotFoundError(service.findById(v4()));
    });

    it('gets by subject', async () => {
      const action = PermissionAction.Create;
      const subject = nanoid();
      const permissionAbility = await service.create({
        action,
        subject,
      });

      const result = await service.findMany({
        subject: permissionAbility.subject,
      });
      expect(permissionAbility).toEqual(result[0]);
    });
  });
});
