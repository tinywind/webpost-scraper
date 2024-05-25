import { createSlice } from '@reduxjs/toolkit';
import util from '@main/window/utilContext';

const KEY = 'dark-mode';
const THEME_DARK = 'dark';
const THEME_LIGHT = 'light';
const THEME_SYSTEM = 'system';

export interface ThemeState {
  theme: 'light' | 'dark' | 'system';
}

export const initialState: ThemeState = { theme: 'system' };

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    load: state => {
      const theme = localStorage.getItem(KEY);
      if (theme === THEME_DARK) {
        state.theme = THEME_DARK;
        util.setDarkMode();
      } else if (theme === THEME_LIGHT) {
        state.theme = THEME_LIGHT;
        util.setLightMode();
      } else {
        state.theme = THEME_SYSTEM;
        util.useSystemMode();
      }
    },
    useSystemMode: state => {
      state.theme = THEME_SYSTEM;
      util.useSystemMode();
      localStorage.setItem(KEY, THEME_SYSTEM);
    },
    setLight: state => {
      state.theme = THEME_LIGHT;
      util.setLightMode();
      localStorage.setItem(KEY, THEME_LIGHT);
    },
    setDark: state => {
      state.theme = THEME_DARK;
      util.setDarkMode();
      localStorage.setItem(KEY, THEME_DARK);
    },
  },
});

export const { load, setLight, setDark, useSystemMode } = themeSlice.actions;

export default themeSlice.reducer;
