import React, { useEffect } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import '@styles/app.css';
import store, { useAppDispatch } from '@renderer/contexts/store';
import { load as loadTheme } from '@renderer/contexts/themeSlice';
import { load as loadSetting } from '@renderer/contexts/settingSlice';

const StoreLoadContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(loadTheme());
    dispatch(loadSetting());
  }, []);
  return <>{children}</>;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ReduxProvider store={store}>
      <StoreLoadContainer>{children}</StoreLoadContainer>
    </ReduxProvider>
  );
};

export default Layout;
