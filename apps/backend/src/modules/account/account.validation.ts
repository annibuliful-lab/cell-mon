import { minLength, object, optional, string } from 'valibot';

export const createAccountSchema = object({
  username: string([minLength(8)]),
  password: string([minLength(8)]),
});

export const updateAccountSchema = object({
  username: optional(string([minLength(8)])),
  password: optional(string([minLength(8)])),
  newPassword: optional(string([minLength(8)])),
});
