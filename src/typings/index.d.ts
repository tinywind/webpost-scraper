declare module '*.css';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';

interface Window {
  electronApi: import('../main/window/utilContext').UtilContextApi & {
    navigator: import('../main/window/navigatorContext').NavigatorContextApi;
  };
}

declare module 'electron-squirrel-startup' {
  const startup: boolean;
  export default startup;
}
