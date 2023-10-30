import { minLength, object, string } from 'valibot';

export const loginSchema = object({
  username: string([minLength(8)]),
  password: string([minLength(8)]),
});
