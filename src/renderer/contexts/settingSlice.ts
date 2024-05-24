import { createSlice } from '@reduxjs/toolkit';
import { Setting } from '@renderer/types';

const KEY = 'setting';

export interface SettingState {
  setting: Setting;
}

export const initialState: SettingState = {
  setting: {
    pollingInterval: 5,
    retention: 3,
    sites: [],
  },
};

const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    load: state => {
      try {
        const string = localStorage.getItem(KEY);
        if (string) {
          state.setting = JSON.parse(string) as Setting;
        }
      } catch (e) {
        console.error(e);
      }
    },
    set: (state, action) => {
      state = action.payload;
      localStorage.setItem(KEY, JSON.stringify(action.payload));
      console.log('Setting saved', action.payload);
      console.log('Setting saved', state);
    },
  },
});

export const { load, set } = settingSlice.actions;

export default settingSlice.reducer;
