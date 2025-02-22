import { parse } from '@babel/parser';
import path from 'node:path';
import fs from 'node:fs';

const filePath = path.join(__dirname, './code.ts');
const code = fs.readFileSync(filePath, 'utf-8');
const ast = parse(code, { sourceType: 'module', plugins: ['typescript'] });
console.log(JSON.stringify(ast, null, 2));
