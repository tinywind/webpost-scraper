import React, { useEffect } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import '@styles/app.scss';
import store, { useAppDispatch, useAppSelector } from '@renderer/contexts/store';
import { useDark, useLight } from '@renderer/contexts/themeSlice';

const ThemeContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const themeState = useAppSelector(state => state.theme);

  useEffect(() => {
    const usingDarkTheme = localStorage.getItem('dark-mode');
    if (usingDarkTheme === 'true') {
      dispatch(useDark());
    } else {
      dispatch(useLight());
    }
  }, []);

  useEffect(() => {
    if (themeState.theme === 'dark') {
      localStorage.setItem('dark-mode', 'true');
      document.body.classList.add('dark-mode');
    } else {
      localStorage.setItem('dark-mode', 'false');
      document.body.classList.remove('dark-mode');
    }
  }, [themeState]);

  return <>{children}</>;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ReduxProvider store={store}>
      <ThemeContainer>{children}</ThemeContainer>
    </ReduxProvider>
  );
};

export default Layout;
