const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const net = require('node:net');
const { spawn } = require('node:child_process');
const { once } = require('node:events');

const project = path.resolve(__dirname, '..');
const executable = path.resolve(process.argv[2] || path.join(project, 'out', `Webpost Scraper-${process.platform}-x64`, `Webpost Scraper${process.platform === 'win32' ? '.exe' : ''}`));
assert.ok(fs.existsSync(executable), `Packaged executable not found: ${executable}`);
fs.mkdirSync(path.join(project, '.tmp'), { recursive: true });
const work = fs.mkdtempSync(path.join(project, '.tmp', 'runtime-smoke-'));
const checks = [];
let child;
let socket;
let sequence = 0;
const pending = new Map();
const exceptions = [];
let servePosts = true;
let deferredResponse;
const fixture = http.createServer((request, response) => {
  if (request.url === '/offline') return response.destroy();
  if (request.url === '/delayed/') { deferredResponse = response; return; }
  if (request.url !== '/news/') response.writeHead(404);
  if (!servePosts) return response.end('<title>Smoke fixture</title>');
  response.end(`<title>Smoke fixture</title><article><a href="first">First smoke post</a><time>${new Date().toISOString()}</time></article><article><a href="/second">Second smoke post</a></article>`);
});

async function waitFor(predicate, label, timeout = 30000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (child?.exitCode != null) throw new Error(`Application exited ${child.exitCode} while waiting for ${label}`);
    if (await predicate()) return;
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  throw new Error(`Timed out waiting for ${label}`);
}

function send(method, params = {}) {
  const id = ++sequence;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`Debugger request timed out: ${method}`));
    }, 10000);
    timer.unref();
    pending.set(id, {
      resolve(value) { clearTimeout(timer); resolve(value); },
      reject(error) { clearTimeout(timer); reject(error); },
    });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}

async function start() {
  const reservation = net.createServer();
  reservation.listen(0, '127.0.0.1');
  await once(reservation, 'listening');
  const port = reservation.address().port;
  await new Promise(resolve => reservation.close(resolve));
  const log = fs.openSync(path.join(work, `app-${checks.length}.log`), 'a');
  child = spawn(executable, [`--remote-debugging-port=${port}`, `--user-data-dir=${path.join(work, 'profile')}`, '--disable-gpu', ...(process.platform === 'linux' ? ['--ozone-platform=x11'] : [])], {
    cwd: work, stdio: ['ignore', log, log], env: { ...process.env, NODE_ENV: 'production' },
  });
  fs.closeSync(log);
  child.on('error', error => exceptions.push(error.message));
  let target;
  await waitFor(async () => {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      target = targets.find(target => target.type === 'page');
      return !!target;
    } catch { return false; }
  }, 'debugging endpoint');
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await once(socket, 'open');
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails);
    if (!message.id) return;
    const operation = pending.get(message.id);
    pending.delete(message.id);
    if (!operation) return;
    if (message.error) operation.reject(new Error(JSON.stringify(message.error)));
    else operation.resolve(message.result);
  });
  await send('Runtime.enable');
  await send('Page.bringToFront');
  await send('Emulation.setFocusEmulationEnabled', { enabled: true });
  await waitFor(() => evaluate("!!window.electronApi && document.body.textContent.includes('Unread (')"), 'renderer');
}

async function stop() {
  const exited = once(child, 'exit');
  await evaluate('window.close()');
  await Promise.race([exited, new Promise((_, reject) => setTimeout(() => reject(new Error('Application did not close')), 10000))]);
  socket.close();
  child = undefined;
}

async function check(name, action) {
  await action();
  checks.push(name);
  console.log(`PASS ${name}`);
}

async function clickButton(prefix) {
  await evaluate(`Array.from(document.querySelectorAll('button')).find(button => button.textContent.startsWith(${JSON.stringify(prefix)})).click()`);
}

async function menu() {
  await evaluate("Array.from(document.querySelectorAll('a')).find(anchor => anchor.textContent.includes('First smoke post')).dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 120, clientY: 180, button: 2 }))");
  await waitFor(() => evaluate("document.activeElement?.getAttribute('role') === 'menu'"), 'context menu focus');
}

async function selectMenu(label) {
  const point = await evaluate(`(() => { const item = Array.from(document.querySelectorAll('[role=menuitem]')).find(item => item.textContent.trim() === ${JSON.stringify(label)}); const rect = item.getBoundingClientRect(); return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }; })()`);
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', ...point });
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, ...point });
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, ...point });
}

async function main() {
  fixture.listen(0, '127.0.0.1');
  await once(fixture, 'listening');
  const base = `http://127.0.0.1:${fixture.address().port}`;
  const site = { _id: 'smoke', id: 'smoke', name: 'Smoke fixture', url: `${base}/news/`, articleSelector: 'article', titleSelector: { selector: 'a', property: 'textContent' }, urlSelector: { selector: 'a', property: 'href' }, createdAtSelector: { selector: 'time', property: 'textContent' } };
  fs.writeFileSync(path.join(work, 'scraper-1__site.db'), JSON.stringify(site) + '\n');
  await start();
  await check('renderer isolation and compiled styles', async () => {
    assert.equal(await evaluate("typeof require"), 'undefined');
    assert.equal(await evaluate("getComputedStyle(document.getElementById('app')).display"), 'flex');
    assert.ok(await evaluate("document.getElementById('app').getBoundingClientRect().height > 400"));
    assert.ok(await evaluate("document.querySelector('[data-scope=contextmenu][data-part=root]').getBoundingClientRect().height > 400"), 'Context menu root preserves the list height');
  });
  await check('network success, HTTP failure and invalid URL', async () => {
    assert.equal(await evaluate(`window.electronApi.fetchSiteData(${JSON.stringify(site.url)}).then(result => result.ok && result.status === 200 && result.html.includes('First smoke post'))`), true);
    assert.equal(await evaluate(`window.electronApi.fetchSiteData(${JSON.stringify(base + '/missing')}).then(result => result.status)`), 404);
    assert.match(await evaluate("window.electronApi.fetchSiteData('').then(() => '', error => error.message)"), /Please enter a URL/);
  });
  await check('periodic scraping and database persistence', async () => {
    await waitFor(() => evaluate('window.electronApi.getPosts().then(posts => posts.length === 2)'), 'scraped posts');
    const posts = await evaluate('window.electronApi.getPosts()');
    assert.deepEqual(posts.map(post => post.url).sort(), [`${base}/news/first`, `${base}/second`].sort());
    assert.ok(posts.every(post => !post.read && !post.marked && post.site.id === 'smoke'));
    await waitFor(() => evaluate("document.body.textContent.includes('Unread (2)')"), 'post list');
  });
  await check('PrimeReact 11 context menu and mark action', async () => {
    await menu();
    assert.equal(await evaluate("document.querySelectorAll('[role=menuitem]').length"), 4);
    await selectMenu('Toggle Mark');
    await waitFor(() => evaluate('window.electronApi.getPosts().then(posts => posts.some(post => post.marked))'), 'marked post');
    await waitFor(() => evaluate("document.body.textContent.includes('Marked (1)')"), 'marked count');
    await clickButton('Marked (');
    await menu();
    assert.equal(await evaluate("document.querySelectorAll('[role=menuitem]').length"), 2);
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await waitFor(() => evaluate("!document.querySelector('[role=menuitem]')"), 'menu dismissal');
    await clickButton('All (');
    await evaluate(`(async () => {
      document.querySelector('.flex-grow.overflow-auto').dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 30, clientY: 500, button: 2 }));
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    })()`);
    assert.equal(await evaluate("document.querySelectorAll('[role=menuitem]').length"), 0, 'Blank space must not act on a previously selected post');
  });
  await check('search and context menu read action', async () => {
    await evaluate("const input = document.querySelector('input[placeholder=Search]'); input.value = 'First smoke'; input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))");
    await waitFor(() => evaluate("Array.from(document.querySelectorAll('a')).filter(a => a.textContent.includes('smoke post') && !a.classList.contains('hidden')).length === 1"), 'search result');
    await evaluate("document.querySelector('input[placeholder=Search]').value = ''; document.querySelector('input[placeholder=Search]').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))");
    await clickButton('Unread (');
    await menu();
    await selectMenu('Clear');
    await waitFor(() => evaluate('window.electronApi.getPosts().then(posts => posts.every(post => post.read))'), 'read posts');
    await clickButton('All (');
  });
  await check('theme changes and settings screen', async () => {
    await evaluate('window.electronApi.setDarkMode()');
    assert.equal(await evaluate("matchMedia('(prefers-color-scheme: dark)').matches"), true);
    await evaluate('window.electronApi.setLightMode()');
    assert.equal(await evaluate("matchMedia('(prefers-color-scheme: dark)').matches"), false);
    await evaluate("document.querySelector('button svg[data-icon=gear]').closest('button').click()");
    await waitFor(() => evaluate("document.body.textContent.includes('Scraper Settings')"), 'settings screen');
  });
  await check('loading and site modal overlays retain transparency', async () => {
    await evaluate(`(() => { const input = document.querySelector('input[placeholder="Enter website URL to crawl"]'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, ${JSON.stringify(base + '/delayed/')}); input.dispatchEvent(new Event('input', { bubbles: true })); })()`);
    await evaluate("document.querySelector('input[placeholder=\"Enter website URL to crawl\"]').parentElement.querySelector('button').click()");
    await waitFor(() => evaluate("!!document.querySelector('.fixed.z-50')"), 'loading overlay');
    assert.match(await evaluate("getComputedStyle(document.querySelector('.fixed.z-50')).backgroundColor"), /[,/]\s*0\.5\)$/);
    await waitFor(() => !!deferredResponse, 'deferred fixture request');
    deferredResponse.end('<title>Deferred smoke fixture</title>');
    await waitFor(() => evaluate("!!document.querySelector('.ReactModalPortal > div')"), 'site editor');
    assert.match(await evaluate("getComputedStyle(document.querySelector('.ReactModalPortal > div')).backgroundColor"), /[,/]\s*0\.5\)$/);
    await evaluate("document.querySelector('[role=dialog] button').click()");
    await waitFor(() => evaluate("!document.querySelector('[role=dialog]')"), 'site editor dismissal');
  });
  await check('settings report failed network requests', async () => {
    await evaluate(`(() => { const input = document.querySelector('input[placeholder="Enter website URL to crawl"]'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, ${JSON.stringify(base + '/offline')}); input.dispatchEvent(new Event('input', { bubbles: true })); })()`);
    await evaluate("document.querySelector('input[placeholder=\"Enter website URL to crawl\"]').parentElement.querySelector('button').click()");
    await waitFor(() => evaluate("document.body.textContent.includes('Failed to load the page:')"), 'network error message', 10000);
    await evaluate("document.querySelector('.swal2-confirm').click()");
  });
  await check('settings and post changes survive restart', async () => {
    servePosts = false;
    await evaluate(`window.electronApi.save({ theme: 'dark', pollingInterval: 1, retention: 7, sites: [${JSON.stringify(site)}] })`);
    await evaluate(`window.electronApi.deletePost(${JSON.stringify(base + '/second')})`);
    await stop();
    await start();
    const setting = await evaluate('window.electronApi.load()');
    assert.equal(setting.theme, 'dark');
    assert.equal(setting.pollingInterval, 1);
    assert.equal(setting.retention, 7);
    assert.equal(setting.sites.length, 1);
    const posts = await evaluate('window.electronApi.getPosts()');
    assert.equal(posts.length, 1);
    assert.equal(posts[0].read, true);
    assert.equal(posts[0].marked, true);
  });
  assert.deepEqual(exceptions, [], 'Renderer exceptions');
  await stop();
  fs.writeFileSync(path.join(work, 'receipt.json'), JSON.stringify({ executable, checks, exceptions }, null, 2));
  console.log(JSON.stringify({ work, passed: checks.length }));
}

main().catch(async error => {
  console.error(error);
  if (socket?.readyState === WebSocket.OPEN) {
    try {
      const diagnostics = await evaluate(`(async () => ({ text: document.body.innerText, focus: { tag: document.activeElement.tagName, role: document.activeElement.getAttribute('role'), documentFocused: document.hasFocus() }, posts: await window.electronApi.getPosts(), menus: Array.from(document.querySelectorAll('[role=menuitem]')).map(item => ({ text: item.innerText, rect: item.getBoundingClientRect().toJSON(), style: getComputedStyle(item).display })) }))()`);
      fs.writeFileSync(path.join(work, 'renderer.json'), JSON.stringify(diagnostics, null, 2));
    } catch (diagnosticError) { console.error(diagnosticError.message); }
  }
  fs.writeFileSync(path.join(work, 'failure.json'), JSON.stringify({ error: error.stack, checks, exceptions }, null, 2));
  process.exitCode = 1;
}).finally(() => {
  socket?.close();
  child?.kill();
  fixture.close();
});
