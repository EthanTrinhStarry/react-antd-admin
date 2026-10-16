import type { LoginParams } from '../interface/user/login';
import type { Dispatch } from '@reduxjs/toolkit';

import { apiLogin, apiLogout } from '../api/user.api';
import { browserStorage, STORAGE_KEYS } from '../utils/storage';
import { setUserItem } from './user.store';
import { createAsyncAction } from './utils';
// typed wrapper async thunk function demo, no extra feature, just for powerful typings
export const loginAsync = createAsyncAction<LoginParams, boolean>(payload => {
  return async dispatch => {
    const { result, status } = await apiLogin(payload);

    if (status) {
      browserStorage.set(STORAGE_KEYS.token, result.token);
      browserStorage.set(STORAGE_KEYS.username, result.username);
      browserStorage.set(STORAGE_KEYS.role, result.role);
      dispatch(
        setUserItem({
          logged: true,
          username: result.username,
          role: result.role,
        }),
      );

      return true;
    }

    return false;
  };
});

export const logoutAsync = () => {
  return async (dispatch: Dispatch) => {
    const { status } = await apiLogout({ token: browserStorage.get(STORAGE_KEYS.token) || '' });

    if (status) {
      browserStorage.remove(STORAGE_KEYS.token, STORAGE_KEYS.username, STORAGE_KEYS.role);
      dispatch(
        setUserItem({
          logged: false,
          username: '',
          role: '',
        }),
      );

      return true;
    }

    return false;
  };
};
