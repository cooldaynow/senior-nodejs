/* Resolve */
/* Просто успешный промис */
Promise.resolve('resolve-1 (then)').then(console.log);

/* Reject */
/* Промис с ошибкой, ловим в catch */
Promise.reject('reject-1 (catch)').catch(console.error);

/* All */
/* Промис ждет завершения всех промисов, на выходе массив результатов */
Promise.all([Promise.resolve('all-1'), Promise.resolve('all-2'), Promise.resolve('all-3')]).then(console.log);

/* Race */
/* Гонка промисов, ждем первый выполненный (race-3) */
const timeoutPromise1 = new Promise((resolve) => {
  setTimeout(() => {
    resolve('race-1');
  }, 1000);
});
const timeoutPromise2 = new Promise((resolve) => {
  setTimeout(() => {
    resolve('race-2');
  }, 500);
});
const timeoutPromise3 = new Promise((resolve) => {
  setTimeout(() => {
    resolve('race-3');
  }, 0);
});

Promise.race([timeoutPromise1, timeoutPromise2, timeoutPromise3]).then(console.log);

/* Any */
/* Ждем первый успешный (any-2) */
const errorPromise = new Promise((_, reject) => {
  setTimeout(() => {
    reject('any-1 (error)');
  }, 10);
});

const successPromise = new Promise((resolve) => {
  setTimeout(() => {
    resolve('any-2 (success)');
  }, 1000);
});

Promise.any([errorPromise, successPromise]).then(console.log);
