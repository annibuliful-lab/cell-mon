import { atom } from 'jotai';
import { atomWithImmer } from 'jotai-immer';

type Authentication = {
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
};

export const authAtom = atomWithImmer<Authentication>({
  token: null,
  refreshToken: null,
  loading: false,
});

export const authAction = atom(
  null,
  (get, set, payload: Partial<Authentication>) => {
    set(authAtom, { ...get(authAtom), ...payload });
  },
);
