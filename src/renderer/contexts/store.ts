import { useDispatch, useSelector } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import { thunk } from 'redux-thunk';
import themeReducer from './themeSlice';
import settingReducer from './settingSlice';

const logger = createLogger();

const rootReducer = combineReducers({
  theme: themeReducer,
  setting: settingReducer,
});

const initialState = {};

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => {
    const middleware = getDefaultMiddleware().concat(thunk);
    return process.env.NODE_ENV === 'development' ? middleware.concat(logger) : middleware;
  },
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState: initialState,
  enhancers: defaultEnhancers => defaultEnhancers(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export default store;
