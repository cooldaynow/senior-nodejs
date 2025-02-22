import ts from 'typescript';
import fs from 'node:fs';
import { join } from 'node:path';

const filePath = join(__dirname, './code.ts');
console.log({ filePath });
const code = fs.readFileSync(filePath, 'utf-8');
const ast = ts.createSourceFile(filePath, code, ts.ScriptTarget.ESNext, true);
console.log(ast);
