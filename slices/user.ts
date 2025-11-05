import { slice } from "killua";

export type UserState = {
  token: string | null;
  username: string | null;
  fullName: string | null;
};

export const userSlice = slice({
  key: "user",
  defaultClient: { token: null, username: null, fullName: null } as UserState,
  defaultServer: { token: null, username: null, fullName: null } as UserState,
  selectors: {
    isAuthenticated: (value: UserState) => Boolean(value.token),
    getToken: (value: UserState) => value.token,
    getUsername: (value: UserState) => value.username,
    getFullName: (value: UserState) => value.fullName,
  },
  reducers: {
    setUser: (_: UserState, payload: UserState) => payload,
    setToken: (value: UserState, token: string) => ({ ...value, token }),
    logout: () => ({ token: null, username: null, fullName: null }),
  },
});
