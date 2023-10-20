import { atom } from 'jotai';
import { atomWithImmer } from 'jotai-immer';

type ErrorMessage = {
  code: string | number | null;
  message: string | null;
};

export const errorAtom = atomWithImmer<ErrorMessage[]>([]);

export const errorAction = atom(
  null,
  (get, set, payload: Partial<ErrorMessage>) => {
    set(errorAtom, { ...get(errorAtom), ...payload });
  },
);
