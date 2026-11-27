const assert = require('node:assert/strict');
const { test } = require('node:test');
const { loadSource } = require('./load-source.cjs');
const { extractPosts } = loadSource('src/common/extractPosts.ts');

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

test('scopes extraction to each article and includes a matching root', () => {
  const posts = extractPosts('<a href="one">One</a><a href="two">Two</a>', { ...site, articleSelector: 'a', createdAtSelector: undefined });
  assert.deepEqual(posts.map(post => post.title), ['One', 'Two']);
});

test('parses a multi-article document once', () => {
  const cheerio = require('cheerio');
  let parses = 0;
  const { extractPosts } = loadSource('src/common/extractPosts.ts', {
    cheerio: { load: html => { parses++; return cheerio.load(html); } },
  });
  const posts = extractPosts('<article><a href="1">One</a></article><article><a href="2">Two</a></article>', site);
  assert.equal(posts.length, 2);
  assert.equal(parses, 1);
});

test('incomplete sites, empty links and invalid links do not emit posts', () => {
  const html = '<article><a>Missing</a></article><article><a href="  ">Empty</a></article><article><a href="http://[">Invalid</a></article><article><a href="ok">Valid</a></article>';
  for (const key of ['articleSelector', 'titleSelector', 'urlSelector']) {
    assert.deepEqual(extractPosts(html, { ...site, [key]: undefined }), []);
  }
  assert.deepEqual(extractPosts(html, site).map(post => post.title), ['Valid']);
});

test('invalid optional expressions fall back to the selected property', () => {
  const configured = { ...site };
  for (const key of ['titleSelector', 'urlSelector', 'createdAtSelector']) configured[key] = { ...site[key], regex: '[' };
  const [post] = extractPosts('<article><a href="/one">One</a><time>2026-01-01T00:00:00Z</time></article>', configured);
  assert.equal(post.title, 'One');
  assert.equal(post.url, 'https://example.test/one');
  assert.equal(post.createdAt, Date.parse('2026-01-01T00:00:00Z'));
});
