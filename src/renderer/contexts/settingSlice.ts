import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Setting } from '@src/types';

const initialState: Setting = { theme: 'system', pollingInterval: 5, retention: 3, sites: [] };

const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    received: (_state, action: PayloadAction<Setting>) => action.payload,
  },
});

export const { received } = settingSlice.actions;
export default settingSlice.reducer;
