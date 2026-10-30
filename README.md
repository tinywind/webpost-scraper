# Webpost Scraper

Webpost Scraper is a Windows Electron application for collecting website posts
with configurable selectors, scheduled polling and local storage. It was inspired
by [wepplication tools scrapper](https://wepplication.github.io/tools/scrapper/).

<img src="img.png" alt="Webpost Scraper screenshot 1" width="32%"> <img src="img_1.png" alt="Webpost Scraper screenshot 2" width="32%"> <img src="img_2.png" alt="Webpost Scraper screenshot 3" width="32%">

## Install on Windows x64

Download the `Setup.exe` asset from the repository's
[releases](https://github.com/tinywind/webpost-scraper/releases) and run the
installer. Node.js and pnpm are needed for source development, not for this
packaged application.

## Add a website and collect posts

1. Open `View > Settings` or press `Ctrl+2`.
2. Enter the page URL in `Enter website URL to crawl` and click the search icon.
   The application fetches the page and opens the Site dialog.
3. Set the site's title and the article, title, link and optional date selectors.
   The example below shows how these fields relate to fetched HTML.
4. Click the eye icon beside the URL to preview the extracted posts. Adjust the
   selectors until the preview contains the intended titles and links.
5. Click the checkmark button at the bottom of the dialog to save the site.
6. Choose an `Update Interval` and `Retention Period` in settings. Leave the
   application open for scheduled collection, then use `View > List` or `Ctrl+1`
   to view collected posts.

The defaults are a five-minute update interval and three-day retention period.
Settings changes are saved locally. The download and upload icons in settings
export and import the site configuration and polling/retention settings.
The Theme menu selects Light, Dark or System mode.

### Selector example

For a page whose fetched HTML contains entries like this:

```html
<article class="post">
  <h2><a href="/posts/hello">Hello world</a></h2>
  <time>2026-10-30T09:00:00Z</time>
</article>
```

Use the following fields in the Site dialog:

| Field | Selector | Property | Regex |
| --- | --- | --- | --- |
| Article Selector | `article.post` | Not used | Not used |
| Title Selector | `h2 a` | `textContent` | Leave blank |
| Link Selector | `h2 a` | `href` | Leave blank |
| Date Selector | `time` | `textContent` | Leave blank |

The article selector identifies each post container. The other selectors run
inside each container. A relative link such as `/posts/hello` is resolved against
the configured page URL. A missing or unparseable date falls back to the current
time. The optional regex extracts a matching part of a selected property.

Replace the example selectors with selectors that match your page's returned
HTML. Collection parses fetched HTML with Cheerio; it does not execute the site's
page scripts to populate JavaScript-rendered content.

## Features

- Collect posts from configured websites and keep them in local storage.
- Receive desktop notifications when polling finds new posts.
- Use the List and Settings keyboard shortcuts and the light, dark or system theme.
- Adjust the desktop window size to the available screen space.

## Run from source

### Prerequisites

- A supported Node.js version: `^22.13.0 || ^24.0.0 || >=26.0.0`.
- pnpm 12.16.1, pinned in `package.json`. Verification uses Node.js 24.

Install the pinned package manager if needed:

```bash
npm install --global pnpm@12.16.1
```

From the repository directory:

```bash
pnpm install --frozen-lockfile
pnpm start
```

### Development checks and packaging

Run the existing checks before packaging:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm package
```

Run `node test/runtime-smoke.cjs` against the packaged executable. On Linux, use
`xvfb-run -a node test/runtime-smoke.cjs`. An optional first argument selects an
executable outside `out/`. The smoke test uses a loopback HTTP fixture and isolated
databases/profile under `.tmp/`, where it leaves diagnostics. It checks collection,
menus, search, themes, loading/modal transparency, error messages and persistence
without using existing application data.

The Windows Package Check workflow builds the x64 Squirrel installer, runs the
packaged application smoke test and uploads the tested installer. Desktop
notification delivery and the interactive installer wizard still require manual
verification.

### Implementation notes

The application uses Electron, React 19, Redux, React Router, PrimeReact 11
primitives and Tailwind CSS 4. The main process uses `@seald-io/nedb` for persistent
storage. The workspace uses the hoisted dependency layout required by Electron
Forge and pins SockJS's CommonJS UUID dependency to the patched 11.1.1 release.

Type checking uses TypeScript 7.0.2 through the `@typescript/native` alias. The
`typescript` alias supplies Microsoft's `@typescript/typescript6` compatibility
package because typescript-eslint and ts-loader need the JavaScript compiler API
removed in TypeScript 7. See Microsoft's
[side-by-side setup](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-60).
The explicit `strict: false` setting preserves the previous compiler defaults,
with `noImplicitAny` enabled.

ESLint 10 uses flat configuration. `@eslint/compat` adapts the React and import
plugins, whose declared ESLint peer ranges still stop at version 9.

## License

This project is licensed under the MIT License. PrimeReact 11 dependencies use
the [PrimeUI License](https://primeui.dev/licenses); their license terms are
separate from this project's MIT license.

## Acknowledgements

The project uses the
[electron-react-webpack-typescript-2024](https://github.com/codesbiome/electron-react-webpack-typescript-2024)
template. See its
[LICENSE](https://raw.githubusercontent.com/codesbiome/electron-react-webpack-typescript-2024/master/LICENSE)
for details.

The favicon is used under license from [Flaticon](https://www.flaticon.com/).
Its use is subject to the
[Freepik Company Flaticon terms](https://www.freepikcompany.com/legal/#nav-flaticon).
