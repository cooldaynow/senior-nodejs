(async () => {
  try {
    const first = await new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve('Шаг 1');
      }, 1000);
    });
    console.log(first);
    const second = await new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve('Шаг 2');
      }, 2000);
    });
    console.log(second);
    const third = await new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve('Шаг 3');
      }, 3000);
    });
    console.log(third);
  } catch (e) {
    console.error(e);
  } finally {
    console.log('Готово');
  }
})();
