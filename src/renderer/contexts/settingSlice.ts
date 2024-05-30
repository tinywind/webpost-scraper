import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Setting, Site, ThemeType } from '@src/types';
import util from '@main/window/utilContextApi';

type PayloadAction<P = void, T extends string = string, M = never, E = never> = { payload: P; type: T } & ([M] extends [never] ? Record<string, never> : { meta: M }) &
  ([E] extends [never] ? Record<string, never> : { error: E });

export type SettingState = { setting: Setting };
export const initialState: SettingState = { setting: { theme: 'system', pollingInterval: 5, retention: 3, sites: [] } };

const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    _load: (state, action: PayloadAction<{ theme: ThemeType; pollingInterval: number; retention: number; sites: Site[] }>) => {
      state.setting.theme = action.payload.theme;
      state.setting.pollingInterval = action.payload.pollingInterval;
      state.setting.retention = action.payload.retention;
      state.setting.sites = action.payload.sites;
    },
    save: (state, action: PayloadAction<{ setting: Setting }>) => {
      state.setting = action.payload.setting;
      util.save(action.payload.setting);
    },
    setTheme: (state, action: PayloadAction<{ theme: ThemeType }>) => {
      state.setting.theme = action.payload.theme;
      if (action.payload.theme === 'system') {
        util.useSystemMode();
      } else if (action.payload.theme === 'light') {
        util.setLightMode();
      } else if (action.payload.theme === 'dark') {
        util.setDarkMode();
      }
    },
    setPollingInterval: (state, action: PayloadAction<{ pollingInterval: number }>) => {
      state.setting.pollingInterval = action.payload.pollingInterval;
      util.setPollingInterval(action.payload.pollingInterval);
    },
    setRetention: (state, action: PayloadAction<{ retention: number }>) => {
      state.setting.retention = action.payload.retention;
      util.setRetention(action.payload.retention);
    },
    addSite: (state, action: PayloadAction<{ site: Site }>) => {
      state.setting.sites.push(action.payload.site);
      util.insertSite(action.payload.site);
    },
    updateSite: (state, action: PayloadAction<{ id: string; site: Site }>) => {
      const index = state.setting.sites.findIndex(site => site.id === action.payload.id);
      state.setting.sites[index] = action.payload.site;
      util.updateSite(action.payload.site);
    },
    deleteSite: (state, action: PayloadAction<{ id: string }>) => {
      state.setting.sites = state.setting.sites.filter(site => site.id !== action.payload.id);
      util.deleteSite(action.payload.id);
    },
  },
  extraReducers: builder => {
    builder.addCase(load.fulfilled, (state, action) => {
      state.setting.theme = action.payload.theme;
      state.setting.pollingInterval = action.payload.pollingInterval;
      state.setting.retention = action.payload.retention;
      state.setting.sites = action.payload.sites;
    });
  },
});

const { _load, save, setPollingInterval, setRetention, addSite, updateSite, deleteSite } = settingSlice.actions;
const load = createAsyncThunk(_load.type, async () => await util.load());

export { load, save, setPollingInterval, setRetention, addSite, updateSite, deleteSite };
export default settingSlice.reducer;

load();
