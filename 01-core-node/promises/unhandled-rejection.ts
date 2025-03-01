/* Ловим ошибки, который могли попасть в global */
process.on('unhandledRejection', (error: unknown) => {
  const message = error instanceof Error ? error.message : error;
  console.error(`Необработанная ошибка: ${message}`);
});

(async () => {
  await new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('PROMISE ERROR 1 SEC'));
    }, 1000);
  });
})();
