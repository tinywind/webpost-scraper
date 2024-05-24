import { contextBridge } from 'electron';
import titlebarContext from './titlebarContext';
import utilContext from '@main/window/utilContext';

contextBridge.exposeInMainWorld('electron_window', {
  titlebar: titlebarContext,
});

contextBridge.exposeInMainWorld('electron_utils', utilContext);
