import type { Locale, UserState } from '@/interface/user/user';
import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

const initialState: UserState = {
  hydrated: false,
  device: 'DESKTOP',
  collapsed: false,
  noticeCount: 0,
  locale: 'en_US' as Locale,
  newUser: true,
  logged: false,
  menuList: [],
  username: '',
  role: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserItem(state, action: PayloadAction<Partial<UserState>>) {
      Object.assign(state, action.payload);
    },
  },
});

export const { setUserItem } = userSlice.actions;

export default userSlice.reducer;
