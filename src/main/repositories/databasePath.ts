import fs from 'node:fs';
import path from 'node:path';

const legacyNames = ['site', 'attribute', 'post'].flatMap(table =>
  ['', '~'].map(suffix => `scraper-1__${table}.db${suffix}`));

export function hasUnmigratedDatabase(userData: string, directory: string) {
  return !fs.existsSync(path.join(userData, 'scraper-data')) && legacyNames.some(name => fs.existsSync(path.join(directory, name)));
}

export function prepareDatabaseDirectory(userData: string, legacy?: string) {
  const target = path.join(userData, 'scraper-data');
  if (legacy === undefined) {
    fs.mkdirSync(target, { recursive: true });
    return;
  }
  if (!path.isAbsolute(legacy)) throw new Error('Select an absolute legacy database directory.');
  if (fs.existsSync(target)) throw new Error(`Database directory already exists: ${target}`);
  const files = fs.readdirSync(legacy).filter(name => legacyNames.includes(name));
  if (!files.length) throw new Error('No legacy database files found.');
  fs.mkdirSync(userData, { recursive: true });
  const staging = fs.mkdtempSync(path.join(userData, 'database-import-'));
  try {
    for (const file of files) fs.copyFileSync(path.join(legacy, file), path.join(staging, file));
    fs.renameSync(staging, target);
  } finally {
    fs.rmSync(staging, { recursive: true, force: true });
  }
}
