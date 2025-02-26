/* Вычисление факториала start => end  */
export const factorialArrCalc = (arr: number[]) => {
  const [start] = arr;
  const [end] = arr.reverse();

  /* Рекурсивное вычисление факториала */
  const factorial = (n: number): number => {
    if (n === start) return n;
    return n * factorial(n - 1);
  };
  return factorial(end);
};

/* Разбить число на чанки с последовательностью */
export const sliceToChunks = (arr: number[], step: number = 5): number[][] => {
  let start = 0;
  const chunks: number[][] = [];

  while (start < arr.length) {
    const localEnd = start + step;
    const end = Math.min(localEnd, arr.length);
    const chunk = arr.slice(start, end);
    chunks.push(chunk);
    start = localEnd;
  }
  return chunks;
};

/* Подсчет финальной суммы чанков */
export const summaryCalc = (arr: number[]) =>
  arr.reduce((acc, e) => {
    acc *= e;
    return acc;
  }, 1);
