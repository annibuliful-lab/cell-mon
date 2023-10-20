import { FormErrors } from '@mantine/form';
import { BaseSchema, parse, ValiError } from 'valibot';

export function valibotResolver<T extends Record<string, unknown>>(
  schema: BaseSchema<T>,
) {
  return (values: T): FormErrors => {
    try {
      parse(schema, values);

      return {};
    } catch (errors) {
      const results: Record<string, string> = {};

      (errors as ValiError).issues.forEach((error) => {
        results[error.path.map((p) => p.key).join('.')] = error.message;
      });
      return results;
    }
  };
}
