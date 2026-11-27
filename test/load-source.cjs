const fs = require('node:fs');
const path = require('node:path');
const { createRequire, Module } = require('node:module');

const project = process.env.TEST_PROJECT_DIR || path.resolve(__dirname, '..');
const requireProject = createRequire(path.join(project, 'package.json'));
const ts = requireProject('typescript');

function loadSource(relative, overrides = {}) {
  const filename = path.resolve(project, relative);
  const compiled = new Module(filename);
  compiled.filename = filename;
  compiled.paths = Module._nodeModulePaths(path.dirname(filename));
  const originalRequire = compiled.require.bind(compiled);
  compiled.require = name => {
    if (Object.hasOwn(overrides, name)) return overrides[name];
    if (name.startsWith('.')) return loadSource(path.resolve(path.dirname(filename), name + '.ts'), overrides);
    return originalRequire(name);
  };
  compiled._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText, filename);
  return compiled.exports;
}

module.exports = { loadSource };
