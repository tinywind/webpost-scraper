import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Setting, Site } from '@renderer/types';
import SiteRepository from '@renderer/repositories/SiteRepository';

type PayloadAction<P = void, T extends string = string, M = never, E = never> = { payload: P; type: T } & ([M] extends [never] ? Record<string, never> : { meta: M }) &
  ([E] extends [never] ? Record<string, never> : { error: E });

const KEY_POLLING_INTERVAL = 'pollingInterval';
const KEY_RETENTION = 'retention';

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

const loadIntegerValue = (key: string, defaultValue: number) => {
  try {
    const string = localStorage.getItem(key);
    if (string) {
      return parseInt(string, 10);
    }
  } catch (e) {
    console.error(e);
  }
  return defaultValue;
};

const repository = new SiteRepository();

const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    _load: (state, action: PayloadAction<{ pollingInterval: number; retention: number; sites: Site[] }>) => {
      state.setting.pollingInterval = action.payload.pollingInterval;
      state.setting.retention = action.payload.retention;
      state.setting.sites = action.payload.sites;
    },
    setPollingInterval: (state, action: PayloadAction<{ pollingInterval: number }>) => {
      state.setting.pollingInterval = action.payload.pollingInterval;
      localStorage.setItem(KEY_POLLING_INTERVAL, action.payload.pollingInterval.toString());
    },
    setRetention: (state, action: PayloadAction<{ retention: number }>) => {
      state.setting.retention = action.payload.retention;
      localStorage.setItem(KEY_RETENTION, action.payload.retention.toString());
    },
    resetSites: (state, action: { payload: { sites: Site[] }; type: string }) => {
      state.setting.sites = action.payload.sites;
      repository.reset().then(() => repository.insert(action.payload.sites));
    },
    addSite: (state, action: PayloadAction<{ site: Site }>) => {
      state.setting.sites.push(action.payload.site);
      repository.insert(action.payload.site);
    },
    updateSite: (state, action: PayloadAction<{ id: string; site: Site }>) => {
      const index = state.setting.sites.findIndex(site => site.id === action.payload.id);
      state.setting.sites[index] = action.payload.site;
      repository.update(action.payload.id, action.payload.site);
    },
    deleteSite: (state, action: PayloadAction<{ id: string }>) => {
      state.setting.sites = state.setting.sites.filter(site => site.id !== action.payload.id);
      repository.remove(action.payload.id);
    },
  },
  extraReducers: builder => {
    builder.addCase(load.fulfilled, (state, action) => {
      state.setting.pollingInterval = action.payload.pollingInterval;
      state.setting.retention = action.payload.retention;
      state.setting.sites = action.payload.sites;
    });
  },
});

const { _load, setPollingInterval, setRetention, resetSites, addSite, updateSite, deleteSite } = settingSlice.actions;
const load = createAsyncThunk(_load.type, async () => {
  const pollingInterval = loadIntegerValue(KEY_POLLING_INTERVAL, 5);
  const retention = loadIntegerValue(KEY_RETENTION, 3);
  const sites: Site[] = await repository.findAll();
  return { pollingInterval, retention, sites };
});

export { load, setPollingInterval, setRetention, resetSites, addSite, updateSite, deleteSite };

export default settingSlice.reducer;

load();
