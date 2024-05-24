import { createSlice } from '@reduxjs/toolkit';

interface ThemeState {
  theme: 'light' | 'dark';
}

const initialState: ThemeState = { theme: 'light' };

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    useLight: state => {
      state.theme = 'light';
    },
    useDark: state => {
      state.theme = 'dark';
    },
  },
});

export const { useLight, useDark } = themeSlice.actions;

export default themeSlice.reducer;
