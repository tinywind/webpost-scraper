import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import themeReducer from './themeSlice';

const logger = createLogger();

const rootReducer = combineReducers({
  theme: themeReducer,
});

const initialState = {};

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => {
    const middleware = getDefaultMiddleware();
    if (process.env.NODE_ENV === 'development') middleware.concat(logger);
    return middleware;
  },
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState: initialState,
  enhancers: defaultEnhancers => defaultEnhancers(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
