// Порядок вывода в консоль: 1, 7, 3, 5, 4, 6, 2
// Сначала синхронный код 1, 7
// В глобальном scope первым идет Promise, значит 3
// Потом идут process.nextTick, первый был зарегистрирован 5, затем 4
// Потом timeouts фаза, но setTimeout еще не готов
// Пропуск всех i/o callbacks, выполнение idle/prepare, пропуск poll
// Дальше выполнение check фазы => завершение setImmediate
// Дальше чек микротасок => их больше нет, переходим к новому циклу
// Timers => тут отрабатывает setTimeout(), который теперь готов

console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

Promise.resolve().then(() => {
  console.log('3');
  process.nextTick(() => console.log('4'));
});

process.nextTick(() => console.log('5'));

setImmediate(() => console.log('6'));

console.log('7');
