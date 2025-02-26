console.log('Начало - 1');

let sum = 0;

for (let i = 0; i < 1e9; i++) {
  sum += i;
}

console.log('Сумма - 2', sum);
console.log('Конец - 3');

// Пока выполняется for, Node.JS зависнет, и никакие другие задачи не выполнятся
