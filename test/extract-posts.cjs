const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire, Module } = require('node:module');
const { test } = require('node:test');

const project = process.env.TEST_PROJECT_DIR || path.resolve(__dirname, '..');
const requireProject = createRequire(path.join(project, 'package.json'));
const ts = requireProject('typescript');
const filename = path.join(project, 'src/types.ts');
const compiled = new Module(filename);
compiled.filename = filename;
compiled.paths = Module._nodeModulePaths(path.dirname(filename));
compiled._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
}).outputText, filename);
const { extractPosts } = compiled.exports;

const site = {
  id: 'fixture-site',
  name: 'Fixture',
  url: 'https://example.test/news/',
  articleSelector: 'article',
  titleSelector: { selector: 'a', property: 'textContent' },
  urlSelector: { selector: 'a', property: 'href' },
  createdAtSelector: { selector: 'time', property: 'textContent' },
};

test('extracts text, relative links, dates and initial post state', () => {
  const posts = extractPosts('<article><a href="first">  First &amp; second  </a><time>2026-10-28T00:00:00Z</time></article>', site);
  assert.equal(posts.length, 1);
  assert.equal(posts[0].title, 'First & second');
  assert.equal(posts[0].url, 'https://example.test/news/first');
  assert.equal(posts[0].createdAt, new Date('2026-10-28').getTime());
  assert.equal(posts[0].read, false);
  assert.equal(posts[0].marked, false);
  assert.equal(posts[0].site, site);
});

test('preserves absolute links and resolves protocol-relative links', () => {
  const posts = extractPosts('<article><a href="https://other.test/a">A</a></article><article><a href="//other.test/b">B</a></article>', site);
  assert.deepEqual(posts.map(post => post.url), ['https://other.test/a', 'https://other.test/b']);
});

test('applies configured regular expressions and filters empty titles', () => {
  const configured = { ...site, titleSelector: { ...site.titleSelector, regex: 'Post \\d+' } };
  const posts = extractPosts('<article><a href="/p">[new] Post 42 end</a></article><article><a href="/empty"> </a></article>', configured);
  assert.equal(posts.length, 1);
  assert.equal(posts[0].title, 'Post 42');
});

test('uses the current time when the selected date is absent', () => {
  const before = Date.now();
  const [post] = extractPosts('<article><a href="/p">Post</a></article>', site);
  assert.ok(post.createdAt >= before && post.createdAt <= Date.now());
});
