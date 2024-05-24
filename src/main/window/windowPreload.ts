import { contextBridge } from 'electron';
import navigatorContext from './navigatorContext';
import utilContext from '@main/window/utilContext';

contextBridge.exposeInMainWorld('electron_window', {
  navigator: navigatorContext,
});

contextBridge.exposeInMainWorld('electron_utils', utilContext);
