/**
 * Copyright (c) 2021, Guasam
 *
 * This software is provided "as-is", without any express or implied warranty. In no event
 * will the authors be held liable for any damages arising from the use of this software.
 * Read the LICENSE file for more details.
 *
 * @author  : guasam
 * @project : Electron Window
 * @package : Window Frame (Component)
 */

import React, { useEffect, useRef } from 'react';
import Navigator from './Navigator';
import logo from '@assets/images/logo.png';
import router from '@renderer/router';

type Props = {
  title?: string;
  borderColor?: string;
  platform: 'windows' | 'mac';
  children: React.ReactNode;
};

type Context = {
  platform: 'windows' | 'mac';
};

export const WindowContext = React.createContext<Context>({
  platform: 'windows',
});

const WindowFrame: React.FC<Props> = props => {
  const itsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { parentElement } = itsRef.current;
    parentElement.classList.add('has-electron-window');
    parentElement.classList.add('has-border');

    // Apply border color if prop given
    if (props.borderColor) {
      parentElement.style.borderColor = props.borderColor;
    }
  }, []);

  return (
    <WindowContext.Provider value={{ platform: props.platform }}>
      <div className='start-electron-window' ref={itsRef}></div>
      <Navigator title={props.title ?? 'Electron Window'} mode='centered-title' icon={logo} />
      <div className='window-content'>{props.children}</div>
    </WindowContext.Provider>
  );
};

export default WindowFrame;
