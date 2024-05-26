import { contextBridge } from 'electron';
import navigatorContext from './navigatorContext';
import utilContext from '@main/window/utilContext';

contextBridge.exposeInMainWorld('electronApi', {
  navigator: navigatorContext,
  ...utilContext,
});
