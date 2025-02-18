#!/bin/bash

# Проверяем, передан ли аргумент (имя файла)
if [ -z "$1" ]; then
  echo "❌ Ошибка: укажите имя TypeScript-файла для запуска."
  echo "Пример: ./run-tsx.sh myfile.ts"
  exit 1
fi

# Проверяем, существует ли файл
if [ ! -f "$1" ]; then
  echo "❌ Ошибка: файл '$1' не найден."
  exit 1
fi

# Запускаем файл через npx tsx
echo "🚀 Запускаем TypeScript-файл: $1"
npx tsx "$1"