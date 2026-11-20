# Security Policy

## Supported Versions

Security fixes are applied on `main` and released for the current `0.2.x` line (currently `0.2.1`).

| Version | Supported |
| ------- | --------- |
| `0.2.x` (`main`) | Yes |
| `< 0.2.0` | No |

## Reporting a Vulnerability

Please do **not** report undisclosed security vulnerabilities through public GitHub issues, pull requests, or discussions.

Use GitHub's [private vulnerability reporting](https://github.com/tinywind/webpost-scraper/security/advisories/new) for this repository to submit a report confidentially. If you cannot use GitHub Security Advisories, contact the maintainer directly at `tinywind0@gmail.com`.

When reporting an issue, please include as much of the following as possible:

- Application version (`package.json`) and operating system (Windows x64 packaged app or source build)
- Affected layer (Electron main process, preload/IPC bridge, renderer UI, HTML selector extraction, or configuration import/export)
- A minimal reproduction or proof of concept
- Description of the potential impact and any suggested mitigation

## Response Process

- We aim to acknowledge receipt of a vulnerability report within 7 days.
- Validated issues are tracked privately through a GitHub Security Advisory while a fix is prepared and verified.
- Once a patched release is available, we will publish the advisory and credit reporters who wish to be acknowledged.

## Scope and Security Model Notes

`webpost-scraper` is an Electron desktop application (`electron` `45.x`) that periodically fetches user-configured web pages, extracts post titles, links, and dates via CSS selectors, and stores results locally.

### In scope

- Electron security boundary weaknesses (context isolation, `nodeIntegration`, IPC validation, or unsafe external URL navigation)
- Cross-site scripting (XSS) or DOM/HTML injection in the renderer when displaying scraped post titles, links, or site previews
- Path traversal or unsafe deserialization in settings export/import or local storage
- Vulnerabilities in bundled Electron or npm dependencies affecting `0.2.x`

### Out of scope

- Malicious websites explicitly configured by the user, except where untrusted HTML breaks out of expected extraction/rendering sanitization into Electron code execution
- Unsupported releases prior to `0.2.0`
