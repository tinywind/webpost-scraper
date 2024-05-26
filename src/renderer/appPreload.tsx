import '@main/window/windowPreload';
import { Setting } from '@src/types';

const setting: Setting = { pollingInterval: 5, retention: 3, sites: [] };

window.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  const { env } = process;
  const versions: Record<string, unknown> = {};

  versions['version'] = env['npm_package_version'];
  versions['license'] = env['npm_package_license'];

  for (const type of ['chrome', 'node', 'electron']) {
    versions[type] = process.versions[type].replace('+', '');
  }

  for (const type of ['react']) {
    const v = env['npm_package_dependencies_' + type];
    if (v) versions[type] = v.replace('^', '');
  }

  for (const type of ['webpack', 'typescript']) {
    const v = env['npm_package_devDependencies_' + type];
    if (v) versions[type] = v.replace('^', '');
  }

  app?.setAttribute('data-versions', JSON.stringify(versions));
});
