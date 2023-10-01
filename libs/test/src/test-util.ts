import { expect } from '@jest/globals';

const dateStringMatcher =
  /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{1,3}Z?$/;

export const matchers = {
  id: expect.any(String),
  createdAt: expect.stringMatching(dateStringMatcher),
  updatedAt: expect.stringMatching(dateStringMatcher),
  meta: expect.any(Object),
};

export function expectForbiddenError(request: Promise<unknown>) {
  return expectError(/FORBIDDEN/i)(request);
}

export function expectAuthenticationError(request: Promise<unknown>) {
  return expectError(/AuthenticationError/)(request);
}

export function expectPermissionError(request: Promise<unknown>) {
  return expectError(/You must have permission/)(request);
}

export function expectUnauthorizedError(request: Promise<unknown>) {
  return expectError(/Unauthorization/)(request);
}

export function expectDuplicatedError(request: Promise<unknown>) {
  return expectError(/Duplicated resources/)(request);
}

export function expectBadUserInputError(request: Promise<unknown>) {
  return expectError(/BAD_USER_INPUT/)(request);
}

export function expectNotFoundError(request: Promise<unknown>) {
  return expectError(/Not found resources/)(request);
}

export function expectExceedResourceLimitError(request: Promise<unknown>) {
  return expectError(/EXCEED_RESOURCE_LIMIT/)(request);
}

export function expectResourceInvalidError(request: Promise<unknown>) {
  return expectError(/RESOURCE_INVALID/)(request);
}

export function expectInternalServerError(request: Promise<unknown>) {
  return expectError(/Internal Server Error/)(request);
}

export function expectRoleError(request: Promise<unknown>) {
  return expectError(/You must have role/)(request);
}

export function expectError(
  error?: string | RegExp | Error
): (request: Promise<unknown>) => Promise<void> {
  return (req) => expect(req).rejects.toThrow(error);
}
