const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { loadSource } = require('./load-source.cjs');

const urls = loadSource('src/common/webUrl.ts');
const site = { id: 'one', url: 'https://example.test', name: 'One' };

test('external navigation allows only absolute HTTP(S) URLs at the shell boundary', async () => {
  const handlers = new Map();
  const opened = [];
  loadSource('src/main/window/navigatorIpc.ts', {
    electron: { ipcMain: { handle: (key, fn) => handlers.set(key, fn) }, shell: { openExternal: url => opened.push(url) } },
    '@common/webUrl': urls, '@main/appWindow': {},
  }).registerNavigatorIpc();
  const open = value => handlers.get('open-url')(null, value);
  for (const value of [null, '', '/relative', 'about:blank', 'mailto:someone@example.test']) assert.throws(() => open(value));
  open('HTTPS://example.test/');
  open('http://example.test/post');
  assert.deepEqual(opened, ['https://example.test/', 'http://example.test/post']);
});

test('site edits replace one entry and failed writes leave settings intact', async () => {
  const handlers = new Map();
  let fail = false;
  const { registerUtilIpc, setting } = loadSource('src/main/window/utilIpc.ts', {
    electron: { ipcMain: { handle: (key, fn) => handlers.set(key, fn) }, nativeTheme: {} },
    '@common/webUrl': urls,
    '@main/repositories/AttributeRepository': { save: async () => { if (fail) throw new Error('Write failed'); } },
    '@main/repositories/PostRepository': {},
  });
  registerUtilIpc();
  const invoke = (channel, arg) => handlers.get(channel)(null, arg);
  await invoke('repository:site:insert', site);
  await Promise.all([
    invoke('repository:site:update', { ...site, name: 'Updated' }),
    invoke('repository:attribute:setRetention', 7),
  ]);
  assert.deepEqual(setting.sites.map(s => s.name), ['Updated']);
  assert.equal(setting.retention, 7);
  await assert.rejects(invoke('repository:save', { ...setting, sites: [site, site] }), /Duplicate/);
  fail = true;
  await assert.rejects(invoke('repository:site:delete', site.id), /Write failed/);
  assert.equal(setting.sites.length, 1);
  fail = false;
  await invoke('repository:site:delete', site.id);
  assert.deepEqual(setting.sites, []);
});

test('a pending poll excludes another tick and one notification click opens the list', async t => {
  let tick, release, attempts = 0, parseCount = 0, win;
  const notices = [];
  const navigations = [];
  t.mock.method(global, 'setInterval', fn => { tick = fn; });
  t.mock.method(console, 'error', () => {});
  class Notice {
    constructor() { notices.push(this); }
    on(event, fn) { assert.equal(event, 'click'); this.click = fn; return this; }
    show() {}
  }
  const setting = { sites: [site], pollingInterval: 1 };
  let now = 60_000;
  t.mock.method(Date, 'now', () => now);
  const { scrapPeriodically } = loadSource('src/main/scrap.ts', {
    electron: { Notification: Notice, net: { fetch: async () => {
      attempts++;
      if (attempts === 1) await new Promise(resolve => { release = resolve; });
      return { ok: attempts > 1, status: 404, text: async () => 'content' };
    } } },
    '@common/extractPosts': { extractPosts: () => { parseCount++; return [{}]; } },
    '@common/webUrl': urls, '@main/repositories/PostRepository': { insert: rows => rows },
    '@main/window/utilIpc': { setting }, '@main/appWindow': { getAppWindow: () => win },
  });
  scrapPeriodically();
  const pending = tick();
  now += 120_000;
  await tick();
  assert.equal(attempts, 1);
  release();
  await pending;
  assert.equal(parseCount, 0);
  await tick();
  assert.equal(parseCount, 1);
  notices[0].click();
  win = { isDestroyed: () => false, isMinimized: () => false, show() {}, focus() {}, webContents: { send: (...args) => navigations.push(args) } };
  notices[0].click();
  assert.equal(notices.length, 1);
  assert.deepEqual(navigations, [['navigate', '/list']]);
});

test('legacy import publishes the selected files together and refuses an existing profile', t => {
  const { prepareDatabaseDirectory, hasUnmigratedDatabase } = loadSource('src/main/repositories/databasePath.ts');
  const tmp = path.resolve(__dirname, '../.tmp');
  fs.mkdirSync(tmp, { recursive: true });
  const root = fs.mkdtempSync(path.join(tmp, 'db-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const profile = path.join(root, 'profile');
  const filename = 'scraper-1__site.db';
  fs.writeFileSync(path.join(root, filename), 'original');
  assert.equal(hasUnmigratedDatabase(profile, root), true);
  prepareDatabaseDirectory(profile, root);
  assert.equal(hasUnmigratedDatabase(profile, root), false);
  const target = path.join(profile, 'scraper-data', filename);
  assert.equal(fs.readFileSync(target, 'utf8'), 'original');
  fs.writeFileSync(target, 'current');
  assert.throws(() => prepareDatabaseDirectory(profile, root), /already exists/);
  assert.equal(fs.readFileSync(target, 'utf8'), 'current');
  assert.equal(fs.readFileSync(path.join(root, filename), 'utf8'), 'original');
});
