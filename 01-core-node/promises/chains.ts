/* Выполнится через ~1 сек */
new Promise((resolve) => {
  setTimeout(() => {
    resolve('Шаг 1');
  }, 1000);
})
  /* Выполнится через ~2 сек после первого промиса */
  .then((value) => {
    console.log(value);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('Шаг 2');
      }, 2000);
    });
  })
  /* Выполнится через ~3 сек после первого промиса */
  .then((value) => {
    console.log(value);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('Шаг 3');
      }, 3000);
    });
  })
  .then(console.log)
  .catch(console.error)
  /* Консоль после выполнения всех промисов */
  .finally(() => {
    console.log('Готово');
  });
