import fs from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const sourceRoot = path.join(root, 'src');
const violations = [];
let files = 0;
let imports = 0;

function area(file) {
  const relative = path.relative(sourceRoot, file).split(path.sep).join('/');
  if (relative.startsWith('libs/apiservices/')) return 'data';
  if (relative.startsWith('libs/store/')) return 'business';
  if (relative.startsWith('libs/utils/')) return 'utils';
  if (/^(components|pages)\//.test(relative)) return 'ui';
  return 'composition-or-fixtures';
}

function allowed(from, to, specifier) {
  if (from === 'data') return !['business', 'ui', 'utils'].includes(to)
    && !/^(react|react-dom|react-router)(\/|$)/.test(specifier);
  if (from === 'business') return !['ui', 'utils'].includes(to)
    && !/^(react-dom|react-router)(\/|$)/.test(specifier);
  if (from === 'utils') return specifier.startsWith('.') && to === 'utils';
  if (from === 'ui') return to !== 'data';
  return true;
}

async function visit(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { await visit(file); continue; }
    if (!/\.tsx?$/.test(file) || /\.test\.tsx?$/.test(file)) continue;
    files++;
    const text = await fs.readFile(file, 'utf8');
    const ast = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
    for (const statement of ast.statements) {
      if (!ts.isImportDeclaration(statement) && !ts.isExportDeclaration(statement)) continue;
      const literal = statement.moduleSpecifier;
      if (!literal || !ts.isStringLiteral(literal)) continue;
      imports++;
      const specifier = literal.text;
      const resolved = specifier.startsWith('.')
        ? path.resolve(path.dirname(file), specifier) : undefined;
      const to = resolved ? area(resolved) : 'external';
      const from = area(file);
      const entersComposition = resolved && to === 'composition-or-fixtures'
        && from !== 'composition-or-fixtures';
      const fixtureAccess = from === 'data' && resolved
        && path.relative(sourceRoot, resolved).split(path.sep).join('/').startsWith('data/');
      if (!allowed(from, to, specifier) || (entersComposition && !fixtureAccess)) {
        const line = ast.getLineAndCharacterOfPosition(statement.getStart(ast)).line + 1;
        violations.push(path.relative(root, file) + ':' + line + ' ' + from + ' -> ' + specifier);
      }
    }
  }
}
await visit(sourceRoot);
if (violations.length) {
  console.error(violations.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Layer checks passed: ' + files + ' runtime files, ' + imports + ' static imports/exports.');
}
