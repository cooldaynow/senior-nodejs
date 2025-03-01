type PromiseWithTimeoutId<T = never> = { timeoutId: NodeJS.Timeout | null; promise: Promise<T> };

/* Выполнить cb после ms */
const timeout = (cb: () => any, ms: number) => {
  let timeoutId: NodeJS.Timeout | null = null;
  const promise = new Promise((resolve) => {
    timeoutId = setTimeout(() => {
      resolve(cb());
    }, ms);
  });
  return { timeoutId, promise };
};

/* Ошибка после ms */
const timeoutError = (ms: number) => {
  let timeoutId: NodeJS.Timeout | null = null;

  const promise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error('Timeout error promise'));
    }, ms);
  });

  return { timeoutId, promise };
};

/* Коллбек на очищение таймаута */
const clearTimeoutById = (timeoutId: NodeJS.Timeout | null) => () => {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
};

/* Подождать промис или упасть по таймауту (очищаем таймеры) */
const timeoutPromiseOrFail = async <T>(
  successPromise: PromiseWithTimeoutId<T>,
  errorPromise: PromiseWithTimeoutId<never>
) => {
  return Promise.race([
    successPromise.promise.finally(clearTimeoutById(errorPromise.timeoutId)),
    errorPromise.promise.finally(clearTimeoutById(successPromise.timeoutId)),
  ]);
};

/* Бросаем ошибку */
(async () => {
  try {
    const sum = (a: number, b: number) => () => a + b;
    const successPromise = timeout(sum(2, 3), 1_000);
    const errorPromise = timeoutError(10_000);
    const response = await timeoutPromiseOrFail(successPromise, errorPromise);
    console.log(`Success promise response: sum(2,3) = ${response}`);
  } catch (e: unknown) {
    console.error(e);
  }
})();
