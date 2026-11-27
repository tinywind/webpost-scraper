import { app, dialog, nativeTheme } from 'electron';
import squirrelStartup from 'electron-squirrel-startup';
import { createAppWindow } from './appWindow';
import { scrapPeriodically, removeOldPostsPeriodically } from '@main/scrap';
import { setting, registerUtilIpc } from '@main/window/utilIpc';
import { registerNavigatorIpc } from '@main/window/navigatorIpc';
import attributeRepository from './repositories/AttributeRepository';
import { hasUnmigratedDatabase, prepareDatabaseDirectory } from './repositories/databasePath';

if (squirrelStartup || !app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.whenReady().then(async () => {
    const userData = app.getPath('userData');
    let legacy = app.commandLine.hasSwitch('import-legacy-db') ? app.commandLine.getSwitchValue('import-legacy-db') : undefined;
    if (legacy === undefined && hasUnmigratedDatabase(userData, process.cwd())) {
      const { response } = await dialog.showMessageBox({
        type: 'question', message: 'Copy the existing Webpost Scraper data into this profile?',
        detail: `Source: ${process.cwd()}\nProfile: ${userData}`,
        buttons: ['Copy existing data', 'Start empty', 'Quit'], defaultId: 0, cancelId: 2,
      });
      if (response === 2) { app.quit(); return; }
      if (response === 0) legacy = process.cwd();
    }
    prepareDatabaseDirectory(userData, legacy);
    Object.assign(setting, await attributeRepository.get());
    nativeTheme.themeSource = setting.theme;
    registerUtilIpc();
    registerNavigatorIpc();
    await createAppWindow();
    scrapPeriodically();
    removeOldPostsPeriodically();
  }).catch(cause => {
    dialog.showErrorBox('Could not start Webpost Scraper', String(cause));
    app.quit();
  });
}
app.on('window-all-closed', () => app.quit());
