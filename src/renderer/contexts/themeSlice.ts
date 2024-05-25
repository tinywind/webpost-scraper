import { createSlice } from '@reduxjs/toolkit';
import util from '@main/window/utilContextApi';

const KEY = 'dark-mode';

export interface ThemeState {
  theme: 'light' | 'dark';
}

export const initialState: ThemeState = { theme: 'dark' };

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    load: state => {
      const usingDarkTheme = localStorage.getItem(KEY);
      if (usingDarkTheme !== 'true') {
        state.theme = 'light';
        localStorage.setItem(KEY, 'false');
        // document.body.classList.remove(KEY);
        util.setLightMode();
      } else {
        state.theme = 'dark';
        localStorage.setItem(KEY, 'true');
        // document.body.classList.add(KEY);
        util.setDarkMode();
      }
    },
    setLight: state => {
      state.theme = 'light';
      localStorage.setItem(KEY, 'false');
      // document.body.classList.remove(KEY);
      util.setLightMode();
    },
    setDark: state => {
      state.theme = 'dark';
      localStorage.setItem(KEY, 'true');
      // document.body.classList.add(KEY);
      util.setDarkMode();
    },
  },
});

export const { load, setLight, setDark } = themeSlice.actions;

export default themeSlice.reducer;
