import fs from 'fs';
import { parse, ParseResult } from '@babel/parser';
import path from 'node:path';
import { exec } from 'node:child_process';

// 📌 Читаем TypeScript-файл
const filePath = path.join(__dirname, './code.ts');
const code = fs.readFileSync(filePath, 'utf8');

// 📌 Разбираем в AST (Babel)
const ast = parse(code, {
  sourceType: 'module',
  plugins: ['typescript'],
});

// 📌 Функция для обхода AST и построения графа
function traverseAst(node: any, parent = 'root', graph: string[] = []) {
  if (!node || typeof node !== 'object' || !node.type) return;

  // 📌 Формируем label с value (если есть)
  let nodeLabel = node.type;
  if (node.name) nodeLabel += `: ${node.name}`; // Для идентификаторов
  if (node.value) nodeLabel += ` = ${node.value}`;

  const nodeId = `${node.type}_${Math.random().toString(36).substr(2, 5)}`;
  graph.push(`"${nodeId}" [label="${nodeLabel}"];`);
  graph.push(`"${parent}" -> "${nodeId}";`);

  for (const key in node) {
    if (Array.isArray(node[key])) {
      node[key].forEach((child) => traverseAst(child, nodeId, graph));
    } else if (typeof node[key] === 'object' && node[key] !== null) {
      traverseAst(node[key], nodeId, graph);
    }
  }
}

console.log('🛠 Генерируем AST из кода...');
const graphEdges: any[] = [];
traverseAst(ast.program, 'root', graphEdges);
// 📌 Записываем `.dot` файл
const dotFile = `digraph AST {\n${graphEdges.join('\n')}\n}`;
const astDotFilepath = path.join(__dirname, 'ast.dot');
fs.writeFileSync(astDotFilepath, dotFile);
console.log('✅ AST успешно сгенерирован и сохранён в ast.dot.');
console.log('🎨 Генерируем PNG-изображение: dot -Tpng ast.dot -o ast.png');
const astPngFilepath = path.join(__dirname, 'ast.png');
exec(`dot -Tpng ${astDotFilepath} -o ${astPngFilepath}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Ошибка: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(
    `✅ Файл ast.png успешно создан! \n\x1b[1m\x1b[34m🔗 [Открыть файл]\u001b]8;;file://${astPngFilepath}\u001b\\ 👉 Нажми здесь\u001b]8;;\u001b\\\x1b[0m`
  );
});
