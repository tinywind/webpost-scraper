import React, { useEffect } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import store, { useAppDispatch } from '@renderer/contexts/store';
import { load as loadSetting } from '@renderer/contexts/settingSlice';
import { PrimeReactProvider } from '@primereact/core';
import 'primeicons/primeicons.css';
import '@styles/app.css';

const StoreLoadContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(loadSetting());
  }, []);
  return <>{children}</>;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ReduxProvider store={store}>
      <StoreLoadContainer>
        <PrimeReactProvider>{children}</PrimeReactProvider>
      </StoreLoadContainer>
    </ReduxProvider>
  );
};

export default Layout;
